import { Resend } from 'resend';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const TO_EMAIL = 'royokola3@gmail.com';
const FROM_EMAIL = 'info@rauell.systems';

// ── inline helpers (no relative imports — avoids ERR_MODULE_NOT_FOUND) ──────

function applySecurityHeaders(res: VercelResponse) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  res.setHeader('Cache-Control', 'no-store');
}

function isAllowedOrigin(req: VercelRequest): boolean {
  const origin = req.headers.origin;
  if (!origin) return true;

  const allow = new Set([
    'https://royotieno.rauell.systems',
    'https://roy-otieno.vercel.app',
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:8080',
  ]);

  if (process.env.SITE_URL) allow.add(process.env.SITE_URL.trim());
  if (process.env.VERCEL_URL) allow.add(`https://${process.env.VERCEL_URL.trim()}`);
  if (allow.has(origin)) return true;

  try {
    const { protocol, hostname } = new URL(origin);
    if (
      protocol === 'https:' &&
      (
        /^roy-otieno(-[a-z0-9]+)*\.vercel\.app$/.test(hostname) ||
        /^roy-otieno-[a-z0-9]+-roy-okola-otienos-projects\.vercel\.app$/.test(hostname)
      )
    ) return true;
  } catch { /* invalid URL — deny */ }

  return false;
}

function applyCors(req: VercelRequest, res: VercelResponse) {
  const origin = req.headers.origin;
  if (origin && isAllowedOrigin(req)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function getClientIp(req: VercelRequest): string {
  const fwd = req.headers['x-forwarded-for'];
  if (typeof fwd === 'string' && fwd.trim()) return fwd.split(',')[0].trim();
  if (Array.isArray(fwd) && fwd.length) return fwd[0].split(',')[0].trim();
  const real = req.headers['x-real-ip'];
  return typeof real === 'string' ? real.trim() : 'unknown';
}

type RateEntry = { count: number; resetAt: number };
const _bucket = ((globalThis as Record<string, unknown>)['__rl__'] ??=
  new Map<string, RateEntry>()) as Map<string, RateEntry>;

function checkRateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const e = _bucket.get(key);
  if (!e || e.resetAt <= now) {
    _bucket.set(key, { count: 1, resetAt: now + windowMs });
    return { limited: false, retryAfterSec: 0 };
  }
  if (e.count >= limit) {
    return { limited: true, retryAfterSec: Math.ceil((e.resetAt - now) / 1000) };
  }
  e.count += 1;
  return { limited: false, retryAfterSec: 0 };
}

function sanitize(v: unknown): string {
  return typeof v === 'string' ? v.trim() : '';
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

// ── handler ──────────────────────────────────────────────────────────────────

export default async function handler(req: VercelRequest, res: VercelResponse) {
  applySecurityHeaders(res);
  applyCors(req, res);

  if (req.method === 'OPTIONS') return res.status(204).end();

  if (!isAllowedOrigin(req))
    return res.status(403).json({ success: false, error: 'Origin not allowed' });

  if (req.method !== 'POST')
    return res.status(405).json({ success: false, error: 'Method not allowed' });

  const ct = req.headers['content-type'];
  const ctStr = Array.isArray(ct) ? ct.join(';') : (ct ?? '');
  if (!ctStr.toLowerCase().includes('application/json'))
    return res.status(415).json({ success: false, error: 'Content-Type must be application/json' });

  const ip = getClientIp(req);
  const rl = checkRateLimit(`contact:${ip}`, 5, 10 * 60 * 1000);
  if (rl.limited) {
    res.setHeader('Retry-After', String(rl.retryAfterSec));
    return res.status(429).json({ success: false, error: 'Too many requests. Please try again later.' });
  }

  const name    = sanitize(req.body?.name);
  const email   = sanitize(req.body?.email).toLowerCase();
  const subject = sanitize(req.body?.subject);
  const message = sanitize(req.body?.message);

  if (!name || !email || !subject || !message)
    return res.status(400).json({ success: false, error: 'All fields are required' });

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return res.status(400).json({ success: false, error: 'Invalid email address' });

  if (name.length > 80 || subject.length > 140 || message.length > 5000 || email.length > 254)
    return res.status(400).json({ success: false, error: 'One or more fields are too long' });

  if (!process.env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY is not set');
    return res.status(500).json({ success: false, error: 'Service unavailable' });
  }

  // Instantiate inside handler — prevents module-level crash when key is missing
  const resend = new Resend(process.env.RESEND_API_KEY);

  const sn = escapeHtml(name);
  const se = escapeHtml(email);
  const ss = escapeHtml(subject);
  const sm = escapeHtml(message);

  try {
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
            <tr><td style="padding:8px 0;color:#6b7280;width:80px">From</td><td style="padding:8px 0;font-weight:600">${sn}</td></tr>
            <tr><td style="padding:8px 0;color:#6b7280">Email</td><td style="padding:8px 0"><a href="mailto:${se}" style="color:#01696f">${se}</a></td></tr>
            <tr><td style="padding:8px 0;color:#6b7280">Subject</td><td style="padding:8px 0">${ss}</td></tr>
          </table>
          <hr style="border:none;border-top:1px solid #e5e5e5;margin:16px 0">
          <h3 style="color:#374151;margin-bottom:12px">Message</h3>
          <p style="color:#374151;line-height:1.7;white-space:pre-wrap">${sm}</p>
          <hr style="border:none;border-top:1px solid #e5e5e5;margin:24px 0">
          <p style="color:#9ca3af;font-size:12px">Sent via royotieno.rauell.systems</p>
        </div>
      `,
    });

    await resend.emails.send({
      from: `Roy Otieno <${FROM_EMAIL}>`,
      to: email,
      subject: `Re: ${subject}`.slice(0, 180),
      html: `
        <div style="font-family:system-ui,sans-serif;max-width:600px;margin:0 auto;padding:24px">
          <h2 style="color:#01696f">Thanks for reaching out, ${sn}!</h2>
          <p style="color:#374151;line-height:1.7">
            I've received your message and will get back to you as soon as possible — usually within 24 hours.
          </p>
          <p style="color:#374151;line-height:1.7">Here's a copy of what you sent:</p>
          <blockquote style="border-left:3px solid #01696f;margin:16px 0;padding:12px 16px;background:#f0f9f8;border-radius:0 8px 8px 0">
            <strong style="color:#01696f">${ss}</strong><br>
            <span style="color:#374151;white-space:pre-wrap">${sm}</span>
          </blockquote>
          <p style="color:#374151;line-height:1.7">Best regards,<br><strong>Roy Otieno</strong><br>Energy &amp; Mobility Systems Engineer</p>
          <hr style="border:none;border-top:1px solid #e5e5e5;margin:24px 0">
          <p style="color:#9ca3af;font-size:12px">You're receiving this because you submitted a message via
            <a href="https://royotieno.rauell.systems" style="color:#01696f">royotieno.rauell.systems</a>.
          </p>
        </div>
      `,
    });

    return res.status(200).json({ success: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    console.error('Resend contact error:', msg);
    return res.status(500).json({ success: false, error: 'Failed to send email. Please try again.' });
  }
}
