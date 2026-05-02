import { Resend } from 'resend';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { applyCommonSecurityHeaders } from '../_lib/security';

/**
 * Resend inbound email webhook handler.
 * Resend POSTs a notification when an email arrives at info@rauell.systems.
 * We then use the Resend SDK to fetch the full email details.
 *
 * Configure this URL in Resend dashboard:
 * https://resend.com/inbound → https://royotieno.rauell.systems/api/webhooks/inbound
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  applyCommonSecurityHeaders(res);

  if (!process.env.RESEND_API_KEY) {
    console.error('Inbound webhook misconfigured: RESEND_API_KEY is missing');
    return res.status(500).json({ error: 'Service unavailable' });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Acknowledge Resend immediately — must respond 2xx within a few seconds
  res.status(200).json({ received: true });

  try {
    const payload = req.body;
    const emailId: string | undefined = payload?.email_id ?? payload?.id;

    if (!emailId) {
      console.warn('Inbound webhook: no email_id in payload', JSON.stringify(payload));
      return;
    }

    // Fetch full email details via Resend SDK
    const { data: email, error } = await resend.emails.receiving.get(emailId);

    if (error || !email) {
      console.error('Inbound webhook: failed to retrieve email', emailId, error);
      return;
    }

    console.log('Inbound email retrieved:', JSON.stringify({
      id: email.id,
      from: email.from,
      to: email.to,
      subject: email.subject,
      receivedAt: new Date().toISOString(),
    }));

    const subject: string = email.subject ?? '';
    const fromAddress: string =
      Array.isArray(email.from) ? email.from[0] : (email.from ?? '');

    // Handle unsubscribe requests
    if (subject.toLowerCase().includes('unsubscribe')) {
      console.log(`Unsubscribe request from: ${fromAddress}`);
      // TODO: query Supabase to remove fromAddress from your subscribers table
    }

    // Optionally fetch attachments if present
    const emailWithAttachments = email as { attachments?: unknown[] };
    if (emailWithAttachments.attachments?.length) {
      const { data: attachments } = await resend.attachments.receiving.list({ emailId });
      console.log(`Inbound email has ${attachments?.length ?? 0} attachment(s)`);
    }

  } catch (err) {
    console.error('Inbound webhook processing error:', err);
  }
}
