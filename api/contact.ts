import { Resend } from 'resend';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const resend = new Resend(process.env.RESEND_API_KEY);
const TO_EMAIL = 'royokola3@gmail.com';
const FROM_EMAIL = 'onboarding@resend.dev'; // Use your verified domain here once set up

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { name, email, subject, message } = req.body ?? {};

  // Basic server-side validation
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ success: false, error: 'All fields are required' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ success: false, error: 'Invalid email address' });
  }

  try {
    // 1. Notify Roy
    await resend.emails.send({
      from: `Portfolio Contact <${FROM_EMAIL}>`,
      to: TO_EMAIL,
      replyTo: email,
      subject: `[Portfolio] ${subject}`,
      html: `
        <div style="font-family:system-ui,sans-serif;max-width:600px;margin:0 auto;padding:24px">
          <h2 style="color:#01696f;margin-bottom:4px">New message from your portfolio</h2>
          <hr style="border:none;border-top:1px solid #e5e5e5;margin:16px 0">
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="padding:8px 0;color:#6b7280;width:80px">From</td><td style="padding:8px 0;font-weight:600">${name}</td></tr>
            <tr><td style="padding:8px 0;color:#6b7280">Email</td><td style="padding:8px 0"><a href="mailto:${email}" style="color:#01696f">${email}</a></td></tr>
            <tr><td style="padding:8px 0;color:#6b7280">Subject</td><td style="padding:8px 0">${subject}</td></tr>
          </table>
          <hr style="border:none;border-top:1px solid #e5e5e5;margin:16px 0">
          <h3 style="color:#374151;margin-bottom:12px">Message</h3>
          <p style="color:#374151;line-height:1.7;white-space:pre-wrap">${message.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
          <hr style="border:none;border-top:1px solid #e5e5e5;margin:24px 0">
          <p style="color:#9ca3af;font-size:12px">Sent via roy-otieno.vercel.app</p>
        </div>
      `,
    });

    // 2. Auto-reply to sender
    await resend.emails.send({
      from: `Roy Otieno <${FROM_EMAIL}>`,
      to: email,
      subject: `Re: ${subject}`,
      html: `
        <div style="font-family:system-ui,sans-serif;max-width:600px;margin:0 auto;padding:24px">
          <h2 style="color:#01696f">Thanks for reaching out, ${name}!</h2>
          <p style="color:#374151;line-height:1.7">
            I've received your message and will get back to you as soon as possible — usually within 24 hours.
          </p>
          <p style="color:#374151;line-height:1.7">Here's a copy of what you sent:</p>
          <blockquote style="border-left:3px solid #01696f;margin:16px 0;padding:12px 16px;background:#f0f9f8;border-radius:0 8px 8px 0">
            <strong style="color:#01696f">${subject}</strong><br>
            <span style="color:#374151;white-space:pre-wrap">${message.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</span>
          </blockquote>
          <p style="color:#374151;line-height:1.7">Best regards,<br><strong>Roy Otieno</strong><br>Energy &amp; Mobility Systems Engineer</p>
          <hr style="border:none;border-top:1px solid #e5e5e5;margin:24px 0">
          <p style="color:#9ca3af;font-size:12px">You're receiving this because you submitted a message via <a href="https://roy-otieno.vercel.app" style="color:#01696f">roy-otieno.vercel.app</a></p>
        </div>
      `,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Resend contact error:', error);
    return res.status(500).json({ success: false, error: 'Failed to send email. Please try again.' });
  }
}
