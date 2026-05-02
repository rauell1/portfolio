import type { VercelRequest, VercelResponse } from '@vercel/node';
import { applyCommonSecurityHeaders } from '../_lib/security';

/**
 * Resend inbound email webhook handler.
 * Receives forwarded inbound emails from Resend when someone replies
 * to a newsletter or contact email sent via info@rauell.systems.
 *
 * Configure this URL in Resend dashboard:
 * https://resend.com/inbound → https://royotieno.rauell.systems/api/webhooks/inbound
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  applyCommonSecurityHeaders(res);

  // Resend sends a POST with JSON payload
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const payload = req.body;

    // Log inbound email details for debugging
    console.log('Inbound email received:', JSON.stringify({
      from: payload?.from,
      to: payload?.to,
      subject: payload?.subject,
      receivedAt: new Date().toISOString(),
    }));

    const subject: string = payload?.subject ?? '';
    const fromAddress: string = payload?.from ?? '';

    // Handle unsubscribe requests
    if (subject.toLowerCase().includes('unsubscribe')) {
      console.log(`Unsubscribe request from: ${fromAddress}`);
      // TODO: integrate with your subscriber list/Supabase to remove the email
    }

    // Acknowledge receipt to Resend (must return 2xx quickly)
    return res.status(200).json({ received: true });
  } catch (error) {
    console.error('Inbound webhook error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
