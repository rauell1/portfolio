/**
 * POST /api/admin-auth
 *
 * Generates and emails a Supabase magic-link to the admin address.
 * The allowed email lives ONLY in the server-side ADMIN_EMAIL env var —
 * it is never shipped to the browser. All responses are deliberately
 * identical so callers cannot enumerate whether a given email is valid.
 */

import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import {
  applyCommonSecurityHeaders,
  applyCors,
  checkRateLimit,
  enforceJsonRequest,
  getClientIp,
  isAllowedOrigin,
  sanitizeText,
} from './_lib/security';

// ── constants ─────────────────────────────────────────────────────────────────

// Generic message returned in ALL cases (success, wrong email, errors).
// This prevents any form of email enumeration.
const GENERIC_RESPONSE = {
  success: true,
  message: 'If an account exists, a sign-in link has been sent to your email.',
};

const FROM_EMAIL = 'Roy Otieno <info@rauell.systems>';
const SITE_URL   = 'https://royotieno.rauell.systems';

// ── handler ───────────────────────────────────────────────────────────────────

export default async function handler(req: VercelRequest, res: VercelResponse) {
  applyCommonSecurityHeaders(res);
  applyCors(req, res);

  // Preflight
  if (req.method === 'OPTIONS') return res.status(204).end();

  // Origin gate
  if (!isAllowedOrigin(req)) {
    return res.status(403).json({ success: false, error: 'Origin not allowed' });
  }

  // Method gate
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  // Content-type gate
  if (!enforceJsonRequest(req)) {
    return res
      .status(415)
      .json({ success: false, error: 'Content-Type must be application/json' });
  }

  // Rate-limit: 3 attempts per IP per 30 minutes
  const ip = getClientIp(req);
  const rl  = checkRateLimit(`admin-auth:${ip}`, 3, 30 * 60 * 1000);
  if (rl.limited) {
    res.setHeader('Retry-After', String(rl.retryAfterSec));
    return res
      .status(429)
      .json({ success: false, error: 'Too many requests. Please try again later.' });
  }

  const email = sanitizeText(req.body?.email).toLowerCase();

  // Basic format check (not a security gate — just sanity)
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ success: false, error: 'A valid email address is required.' });
  }

  // ── server-side email gate ──────────────────────────────────────────────────
  // ADMIN_EMAIL is a server-only env var. Never use the VITE_ prefix here.
  const adminEmail = (process.env.ADMIN_EMAIL ?? '').toLowerCase().trim();

  if (!adminEmail || email !== adminEmail) {
    // Constant-time-ish delay to frustrate timing attacks
    await new Promise((r) => setTimeout(r, 350 + Math.floor(Math.random() * 250)));
    // Return the same generic success response — no hint that the email was rejected
    return res.status(200).json(GENERIC_RESPONSE);
  }

  // ── Supabase admin client ──────────────────────────────────────────────────
  const supabaseUrl      = process.env.SUPABASE_URL ?? '';
  const serviceRoleKey   = process.env.SUPABASE_SERVICE_ROLE_KEY ?? '';

  if (!supabaseUrl || !serviceRoleKey) {
    console.error('[admin-auth] Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    return res.status(500).json({ success: false, error: 'Service unavailable' });
  }

  const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const siteUrl    = (process.env.SITE_URL ?? SITE_URL).replace(/\/$/, '');
  const redirectTo = `${siteUrl}/admin`;

  let actionLink: string;
  try {
    const { data, error } = await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email: adminEmail,
      options: { redirectTo },
    });

    if (error) throw error;
    if (!data?.properties?.action_link) throw new Error('No action_link in response');

    actionLink = data.properties.action_link;
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[admin-auth] generateLink failed:', msg);
    return res.status(500).json({ success: false, error: 'Service unavailable' });
  }

  // ── send via Resend ────────────────────────────────────────────────────────
  const resendKey = process.env.RESEND_API_KEY ?? '';
  if (!resendKey) {
    console.error('[admin-auth] RESEND_API_KEY is not set');
    return res.status(500).json({ success: false, error: 'Service unavailable' });
  }

  const resend = new Resend(resendKey);

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to:   adminEmail,
      subject: 'Sign in to your dashboard',
      html: `
        <div style="font-family:system-ui,sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;background:#ffffff">
          <h2 style="color:#01696f;margin:0 0 8px">Dashboard sign-in</h2>
          <p style="color:#374151;line-height:1.7;margin:0 0 24px">
            Click the button below to sign in to your portfolio admin dashboard.
            This link expires in 24 hours and can only be used once.
          </p>
          <a href="${actionLink}"
             style="display:inline-block;background:#01696f;color:#ffffff;text-decoration:none;
                    padding:12px 28px;border-radius:8px;font-weight:600;font-size:15px">
            Sign in to Dashboard
          </a>
          <p style="color:#9ca3af;font-size:12px;margin-top:32px;line-height:1.5">
            If you did not request this email, you can safely ignore it.<br>
            This link will expire on its own.
          </p>
          <hr style="border:none;border-top:1px solid #e5e5e5;margin:24px 0">
          <p style="color:#9ca3af;font-size:11px;margin:0">
            Sent from <a href="${siteUrl}" style="color:#01696f">${siteUrl.replace('https://', '')}</a>
          </p>
        </div>
      `,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[admin-auth] Resend error:', msg);
    return res.status(500).json({ success: false, error: 'Service unavailable' });
  }

  return res.status(200).json(GENERIC_RESPONSE);
}
