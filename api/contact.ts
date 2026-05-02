import { Resend } from 'resend';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import {
  applyCommonSecurityHeaders,
  applyCors,
  checkRateLimit,
  enforceJsonRequest,
  escapeHtml,
  getClientIp,
  isAllowedOrigin,
  sanitizeText,
} from './_lib/security';

const TO_EMAIL = 'royokola3@gmail.com';
const FROM_EMAIL = 'info@rauell.systems';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  applyCommonSecurityHeaders(res);
  applyCors(req, res);

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (!isAllowedOrigin(req)) {
    return res.status(403).json({ success: false, error: 'Origin not allowed' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  if (!enforceJsonRequest(req)) {
    return res.status(415).json({ success: false, error: 'Content-Type must be application/json' });
  }

  const ip = getClientIp(req);
  const limit = checkRateLimit(`contact:${ip}`, 5, 10 * 60 * 1000);
  if (limit.limited) {
    res.setHeader('Retry-After', String(limit.retryAfterSec));
    return res.status(429).json({ success: false, error: 'Too many requests. Please try again later.' });
  }

  const name = sanitizeText(req.body?.name);
  const email = sanitizeText(req.body?.email).toLowerCase();
  const subject = sanitizeText(req.body?.subject);
  const message = sanitizeText(req.body?.message);

  // Basic server-side validation
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ success: false, error: 'All fields are required' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ success: false, error: 'Invalid email address' });
  }
  if (name.length > 80 || subject.length > 140 || message.length > 5000 || email.length > 254) {
    return res.status(400).json({ success: false, error: 'One or more fields are too long' });
  }

  if (!process.env.RESEND_API_KEY) {
    console.error('Contact API misconfigured: RESEND_API_KEY is missing');
    return res.status(500).json({ success: false, error: 'Service unavailable' });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeSubject = escapeHtml(subject);
  const safeMessage = escapeHtml(message);

  try {
    // 1. Notify Roy
    await resend.emails.send({
      from: `Portfolio Contact <${FROM_EMAIL}>`,
      to: TO_EMAIL,
      replyTo: email,
      subject: `[Portfolio] ${subject}`.slice(0, 180),
      html: `
        <div style="font-family:system-ui,sans-serif;max-width:600px;margin:0 auto;padding:24px">
          <h2 style="color:#01696f;margin-bottom:4px">New message from your portfolio</h2>
          <hr style="border:none;border-top:1px solid #e5e5e5;margin:16px 0">
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="padding:8px 0;color:#6b7280;width:80px">From</td><td style="padding:8px 0;font-weight:600">${safeName}</td></tr>
            <tr><td style="padding:8px 0;color:#6b7280">Email</td><td style="padding:8px 0"><a href="mailto:${safeEmail}" style="color:#01696f">${safeEmail}</a></td></tr>
            <tr><td style="padding:8px 0;color:#6b7280">Subject</td><td style="padding:8px 0">${safeSubject}</td></tr>
          </table>
          <hr style="border:none;border-top:1px solid #e5e5e5;margin:16px 0">
          <h3 style="color:#374151;margin-bottom:12px">Message</h3>
          <p style="color:#374151;line-height:1.7;white-space:pre-wrap">${safeMessage}</p>
          <hr style="border:none;border-top:1px solid #e5e5e5;margin:24px 0">
          <p style="color:#9ca3af;font-size:12px">Sent via royotieno.rauell.systems</p>
        </div>
      `,
    });

    // 2. Auto-reply to sender
    await resend.emails.send({
      from: `Roy Otieno <${FROM_EMAIL}>`,
      to: email,
      subject: `Re: ${subject}`.slice(0, 180),
      html: `
        <div style="font-family:system-ui,sans-serif;max-width:600px;margin:0 auto;padding:24px">
          <h2 style="color:#01696f">Thanks for reaching out, ${safeName}!</h2>
          <p style="color:#374151;line-height:1.7">
            I've received your message and will get back to you as soon as possible — usually within 24 hours.
          </p>
          <p style="color:#374151;line-height:1.7">Here's a copy of what you sent:</p>
          <blockquote style="border-left:3px solid #01696f;margin:16px 0;padding:12px 16px;background:#f0f9f8;border-radius:0 8px 8px 0">
            <strong style="color:#01696f">${safeSubject}</strong><br>
            <span style="color:#374151;white-space:pre-wrap">${safeMessage}</span>
          </blockquote>
          <p style="color:#374151;line-height:1.7">Best regards,<br><strong>Roy Otieno</strong><br>Energy &amp; Mobility Systems Engineer</p>
          <hr style="border:none;border-top:1px solid #e5e5e5;margin:24px 0">
          <p style="color:#9ca3af;font-size:12px">You're receiving this because you submitted a message via <a href="https://royotieno.rauell.systems" style="color:#01696f">royotieno.rauell.systems</a></p>
        </div>
      `,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Resend contact error:', error);
    return res.status(500).json({ success: false, error: 'Failed to send email. Please try again.' });
  }
}
