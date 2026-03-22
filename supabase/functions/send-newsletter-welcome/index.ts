import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const ADMIN_EMAIL = Deno.env.get("ADMIN_EMAIL") || "royokola3@gmail.com";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NewsletterRequest {
  email: string;
}

// Simple in-memory rate limiting (resets on cold start)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour
const MAX_REQUESTS_PER_WINDOW = 3;

const isRateLimited = (ip: string): boolean => {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return false;
  }
  
  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return true;
  }
  
  record.count++;
  return false;
};

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get client IP for rate limiting
    const clientIP = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || 
                     req.headers.get("x-real-ip") || 
                     "unknown";
    
    // Check rate limit
    if (isRateLimited(clientIP)) {
      console.warn("Rate limit exceeded for IP:", clientIP);
      return new Response(
        JSON.stringify({ success: false, error: "Too many requests. Please try again later." }),
        {
          status: 429,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const { email }: NewsletterRequest = await req.json();

    if (!email) {
      throw new Error("Email is required");
    }

    // Validate email format
    if (!emailRegex.test(email)) {
      throw new Error("Invalid email format");
    }

    // Validate email length
    if (email.length > 255) {
      throw new Error("Email must be less than 255 characters");
    }

    console.log("Sending welcome email to:", email);

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Roy Otieno <onboarding@resend.dev>",
        to: [email],
        subject: "Welcome to Clean Energy Insights! 🌱",
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="margin: 0; padding: 0; background-color: #080808; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
            <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
              <div style="background: linear-gradient(135deg, rgba(37, 146, 189, 0.1), rgba(37, 146, 189, 0.05)); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 40px;">
                
                <div style="text-align: center; margin-bottom: 30px;">
                  <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #2592bd, #1a6d8a); border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; font-weight: bold; font-size: 24px; color: white;">
                    RO
                  </div>
                </div>
                
                <h1 style="color: #ffffff; font-size: 28px; margin-bottom: 20px; text-align: center;">
                  Welcome to the Newsletter! 🌱
                </h1>
                
                <p style="color: #a0a0a0; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                  Thank you for subscribing to my newsletter! I'm excited to share insights on:
                </p>
                
                <ul style="color: #a0a0a0; font-size: 16px; line-height: 1.8; padding-left: 20px;">
                  <li><span style="color: #2592bd;">Renewable Energy</span> - Solar PV, battery storage, and clean tech innovations</li>
                  <li><span style="color: #2592bd;">Electric Mobility</span> - EV infrastructure and the future of transportation</li>
                  <li><span style="color: #2592bd;">Sustainability</span> - Circular economy and environmental stewardship</li>
                </ul>
                
                <p style="color: #a0a0a0; font-size: 16px; line-height: 1.6; margin-top: 20px;">
                  Stay tuned for articles, case studies, and updates from the clean energy sector in East Africa.
                </p>
                
                <div style="text-align: center; margin-top: 30px;">
                  <a href="https://royotieno.com/blog" style="display: inline-block; background: linear-gradient(135deg, #2592bd, #1a6d8a); color: white; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600;">
                    Read the Blog
                  </a>
                </div>
                
                <hr style="border: none; border-top: 1px solid rgba(255,255,255,0.1); margin: 30px 0;">
                
                <p style="color: #666; font-size: 14px; text-align: center;">
                  Roy Otieno | Clean Energy Engineer & E-Mobility Specialist<br>
                  Nairobi, Kenya
                </p>
              </div>
            </div>
          </body>
          </html>
        `,
      }),
    });

    if (!emailResponse.ok) {
      const errorData = await emailResponse.json();
      throw new Error(errorData.message || "Failed to send email");
    }

    console.log("Welcome email sent successfully:", emailResponse);

    // Send admin notification to royokola3@gmail.com
    const adminNotificationResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Roy Otieno <onboarding@resend.dev>",
        to: [ADMIN_EMAIL],
        subject: "New Newsletter Subscriber 📬",
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="margin: 0; padding: 0; background-color: #080808; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
            <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
              <div style="background: linear-gradient(135deg, rgba(37, 146, 189, 0.1), rgba(37, 146, 189, 0.05)); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 40px;">
                <h1 style="color: #ffffff; font-size: 24px; margin-bottom: 20px; text-align: center;">
                  New Newsletter Subscriber 📬
                </h1>
                <p style="color: #a0a0a0; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                  A new subscriber has joined your Clean Energy Insights newsletter:
                </p>
                <div style="background: rgba(37, 146, 189, 0.1); border: 1px solid rgba(37, 146, 189, 0.3); border-radius: 8px; padding: 16px; margin-bottom: 20px;">
                  <p style="color: #2592bd; font-size: 18px; font-weight: 600; margin: 0;">${email}</p>
                </div>
                <hr style="border: none; border-top: 1px solid rgba(255,255,255,0.1); margin: 30px 0;">
                <p style="color: #666; font-size: 14px; text-align: center;">
                  Roy Otieno | Clean Energy Engineer & E-Mobility Specialist<br>
                  Nairobi, Kenya
                </p>
              </div>
            </div>
          </body>
          </html>
        `,
      }),
    });

    if (!adminNotificationResponse.ok) {
      const adminErrorData = await adminNotificationResponse.json().catch(() => ({}));
      console.error(`Failed to send admin notification email: status=${adminNotificationResponse.status}`, adminErrorData);
    } else {
      console.log("Admin notification email sent successfully");
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: unknown) {
    console.error("Error in send-newsletter-welcome function:", error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : "Internal server error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
