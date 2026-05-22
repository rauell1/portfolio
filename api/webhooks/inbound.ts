import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { applyCommonSecurityHeaders } from '../_lib/security';

export const config = {
  api: {
    bodyParser: false,
  },
};

async function getRawBody(req: VercelRequest): Promise<string> {
  const chunks: Uint8Array[] = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks).toString('utf8');
}

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

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!process.env.RESEND_API_KEY) {
    console.error('Inbound webhook misconfigured: RESEND_API_KEY is missing');
    return res.status(500).json({ error: 'Service unavailable' });
  }

  const webhookSecret = process.env.RESEND_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error('Inbound webhook misconfigured: RESEND_WEBHOOK_SECRET is missing');
    return res.status(500).json({ error: 'Service unavailable' });
  }

  const svixId = req.headers['svix-id'];
  const svixTimestamp = req.headers['svix-timestamp'];
  const svixSignature = req.headers['svix-signature'];

  if (!svixId || !svixTimestamp || !svixSignature) {
    console.warn('Inbound webhook: missing signature headers');
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const rawBody = await getRawBody(req);

  try {
    resend.webhooks.verify({
      payload: rawBody,
      headers: {
        'svix-id': Array.isArray(svixId) ? svixId.join('') : svixId,
        'svix-timestamp': Array.isArray(svixTimestamp) ? svixTimestamp.join('') : svixTimestamp,
        'svix-signature': Array.isArray(svixSignature) ? svixSignature.join('') : svixSignature,
      },
      webhookSecret,
    });
  } catch (err) {
    console.error('Inbound webhook signature verification failed:', err);
    return res.status(400).json({ error: 'Invalid signature' });
  }

  // Acknowledge Resend immediately — must respond 2xx within a few seconds
  res.status(200).json({ received: true });

  try {
    const payload = JSON.parse(rawBody);
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
      
      const supabaseUrl = process.env.SUPABASE_URL ?? '';
      const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? '';

      if (supabaseUrl && serviceRoleKey) {
        const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
          auth: { autoRefreshToken: false, persistSession: false },
        });

        const { error: deleteError } = await supabaseAdmin
          .from('newsletter_subscribers')
          .delete()
          .eq('email', fromAddress);

        if (deleteError) {
          console.error(`Failed to unsubscribe ${fromAddress}:`, deleteError.message);
        } else {
          console.log(`Successfully unsubscribed ${fromAddress} from newsletter`);
        }
      } else {
        console.error('Cannot execute unsubscribe: Supabase credentials missing');
      }
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

