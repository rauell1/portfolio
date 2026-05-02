import type { VercelRequest, VercelResponse } from '@vercel/node';

type RateEntry = {
  count: number;
  resetAt: number;
};

const RATE_LIMIT_BUCKET = '__portfolio_rate_limit_bucket__';

const globalStore = globalThis as typeof globalThis & {
  [RATE_LIMIT_BUCKET]?: Map<string, RateEntry>;
};

const bucket = globalStore[RATE_LIMIT_BUCKET] ?? new Map<string, RateEntry>();
globalStore[RATE_LIMIT_BUCKET] = bucket;

export function applyCommonSecurityHeaders(res: VercelResponse) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  res.setHeader('Cross-Origin-Resource-Policy', 'same-site');
}

export function getClientIp(req: VercelRequest): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.trim()) {
    return forwarded.split(',')[0].trim();
  }
  if (Array.isArray(forwarded) && forwarded.length > 0) {
    return forwarded[0].split(',')[0].trim();
  }
  const realIp = req.headers['x-real-ip'];
  if (typeof realIp === 'string' && realIp.trim()) {
    return realIp.trim();
  }
  return 'unknown';
}

export function enforceJsonRequest(req: VercelRequest): boolean {
  const contentType = req.headers['content-type'];
  if (!contentType) {
    return false;
  }
  const normalized = Array.isArray(contentType) ? contentType.join(';') : contentType;
  return normalized.toLowerCase().includes('application/json');
}

export function sanitizeText(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

export function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function isAllowedOrigin(req: VercelRequest): boolean {
  const origin = req.headers.origin;

  // No origin header = same-origin or server-to-server — allow
  if (!origin) {
    return true;
  }

  // Explicit production + local allowlist
  const allowList = new Set<string>([
    'https://royotieno.rauell.systems',
    'https://roy-otieno.vercel.app',
    'http://localhost:8080',
    'http://localhost:5173',
    'http://localhost:3000',
  ]);

  if (process.env.SITE_URL) {
    allowList.add(process.env.SITE_URL.trim());
  }

  if (process.env.VERCEL_URL) {
    allowList.add(`https://${process.env.VERCEL_URL.trim()}`);
  }

  if (allowList.has(origin)) {
    return true;
  }

  // Allow all Vercel preview deployments for this project
  // Covers: roy-otieno-*.vercel.app and roy-otieno-*-roy-okola-otienos-projects.vercel.app
  try {
    const url = new URL(origin);
    if (
      url.protocol === 'https:' &&
      (
        /^roy-otieno(-[a-z0-9]+)*\.vercel\.app$/.test(url.hostname) ||
        /^roy-otieno-[a-z0-9]+-roy-okola-otienos-projects\.vercel\.app$/.test(url.hostname)
      )
    ) {
      return true;
    }
  } catch {
    // Invalid origin URL — deny
  }

  return false;
}

export function applyCors(req: VercelRequest, res: VercelResponse) {
  const origin = req.headers.origin;
  if (origin && isAllowedOrigin(req)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

export function checkRateLimit(key: string, limit: number, windowMs: number): { limited: boolean; retryAfterSec: number } {
  const now = Date.now();
  const entry = bucket.get(key);

  if (!entry || entry.resetAt <= now) {
    bucket.set(key, { count: 1, resetAt: now + windowMs });
    return { limited: false, retryAfterSec: 0 };
  }

  if (entry.count >= limit) {
    return {
      limited: true,
      retryAfterSec: Math.max(1, Math.ceil((entry.resetAt - now) / 1000)),
    };
  }

  entry.count += 1;
  bucket.set(key, entry);
  return { limited: false, retryAfterSec: 0 };
}
