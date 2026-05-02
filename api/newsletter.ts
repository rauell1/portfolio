import { Resend } from 'resend';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const FROM_EMAIL = 'info@rauell.systems';
const OWNER_EMAIL = 'royokola3@gmail.com';

// ── inline helpers (no relative imports — avoids ERR_MODULE_NOT_FOUND) ──────

function applySecurityHeaders(res: VercelResponse) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
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
const _bucket = ((globalThis as Record<string, unknown>)['__rl_news__'] ??=
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
  const rl = checkRateLimit(`newsletter:${ip}`, 10, 10 * 60 * 1000);
  if (rl.limited) {
    res.setHeader('Retry-After', String(rl.retryAfterSec));
    return res.status(429).json({ success: false, error: 'Too many requests. Please try again later.' });
  }

  const email = sanitize(req.body?.email).toLowerCase();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return res.status(400).json({ success: false, error: 'Invalid email address' });

  if (email.length > 254)
    return res.status(400).json({ success: false, error: 'Invalid email length' });

  if (!process.env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY is not set');
    return res.status(500).json({ success: false, error: 'Service unavailable' });
  }

  // Instantiate inside handler — prevents module-level crash when key is missing
  const resend = new Resend(process.env.RESEND_API_KEY);

  const safeEmail = escapeHtml(email);

  try {
    await resend.emails.send({
      from: `Roy Otieno <${FROM_EMAIL}>`,
      to: email,
      subject: "Welcome — you're subscribed!",
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
            To unsubscribe, reply with "Unsubscribe" in the subject line.
          </p>
        </div>
      `,
    });

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
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    console.error('Resend newsletter error:', msg);
    return res.status(500).json({ success: false, error: 'Failed to send welcome email.' });
  }
}
