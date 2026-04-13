import { Resend } from 'resend';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = 'onboarding@resend.dev'; // Replace with your verified domain once set up
const OWNER_EMAIL = 'royokola3@gmail.com';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { email } = req.body ?? {};

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ success: false, error: 'Invalid email address' });
  }

  try {
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
            You subscribed at <a href="https://roy-otieno.vercel.app" style="color:#01696f">roy-otieno.vercel.app</a>.
            To unsubscribe, reply to this email with "Unsubscribe" in the subject.
          </p>
        </div>
      `,
    });

    // 2. Notify owner of new subscriber
    await resend.emails.send({
      from: `Portfolio Newsletter <${FROM_EMAIL}>`,
      to: OWNER_EMAIL,
      subject: `New newsletter subscriber: ${email}`,
      html: `
        <div style="font-family:system-ui,sans-serif;max-width:600px;margin:0 auto;padding:24px">
          <h2 style="color:#01696f">New subscriber</h2>
          <p style="color:#374151"><strong>${email}</strong> just subscribed to your newsletter.</p>
          <p style="color:#9ca3af;font-size:12px">via roy-otieno.vercel.app</p>
        </div>
      `,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Resend newsletter error:', error);
    return res.status(500).json({ success: false, error: 'Failed to send welcome email.' });
  }
}
