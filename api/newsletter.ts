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

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = 'info@rauell.systems';
const OWNER_EMAIL = 'royokola3@gmail.com';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
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
    const limit = checkRateLimit(`newsletter:${ip}`, 10, 10 * 60 * 1000);
    if (limit.limited) {
      res.setHeader('Retry-After', String(limit.retryAfterSec));
      return res.status(429).json({ success: false, error: 'Too many requests. Please try again later.' });
    }

    const email = sanitizeText(req.body?.email).toLowerCase();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ success: false, error: 'Invalid email address' });
    }
    if (email.length > 254) {
      return res.status(400).json({ success: false, error: 'Invalid email length' });
    }

    if (!process.env.RESEND_API_KEY) {
      console.error('Newsletter API misconfigured: RESEND_API_KEY is missing');
      return res.status(500).json({ success: false, error: 'Service unavailable' });
    }

    const safeEmail = escapeHtml(email);

    // 1. Welcome email to subscriber
    await resend.emails.send({
      from: `Roy Otieno <${FROM_EMAIL}>`,
      to: email,
      subject: 'Welcome — you\'re subscribed!',
      html: `
        <div style="font-family:system-ui,sans-serif;max-width:600px;margin:0 auto;padding:24px">
          <h2 style="color:#01696f">You're in!</h2>
          <p style="color:#374151;line-height:1.7">
            Thanks for subscribing. I'll be sharing insights on sustainable energy, EV infrastructure,
            and engineering systems — straight to your inbox.
          </p>
          <p style="color:#374151;line-height:1.7">Stay tuned for updates.</p>
          <p style="color:#374151;line-height:1.7">Best,<br><strong>Roy Otieno</strong></p>
          <hr style="border:none;border-top:1px solid #e5e5e5;margin:24px 0">
          <p style="color:#9ca3af;font-size:12px">
            You subscribed at <a href="https://royotieno.rauell.systems" style="color:#01696f">royotieno.rauell.systems</a>.
            To unsubscribe, reply to this email with "Unsubscribe" in the subject.
          </p>
        </div>
      `,
    });

    // 2. Notify owner of new subscriber
    await resend.emails.send({
      from: `Portfolio Newsletter <${FROM_EMAIL}>`,
      to: OWNER_EMAIL,
      subject: `New newsletter subscriber: ${safeEmail}`.slice(0, 180),
      html: `
        <div style="font-family:system-ui,sans-serif;max-width:600px;margin:0 auto;padding:24px">
          <h2 style="color:#01696f">New subscriber</h2>
          <p style="color:#374151"><strong>${safeEmail}</strong> just subscribed to your newsletter.</p>
          <p style="color:#9ca3af;font-size:12px">via royotieno.rauell.systems</p>
        </div>
      `,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Resend newsletter error:', error);
    return res.status(500).json({ success: false, error: 'Failed to send welcome email.' });
  }
}
