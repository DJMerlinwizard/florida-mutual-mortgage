import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

function clean(value = '') {
  return String(value).replace(/[<>]/g, '').trim();
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = req.body || {};
    const name = clean(body.name);
    const email = clean(body.email);
    const phone = clean(body.phone);
    const loanType = clean(body.loanType);
    const message = clean(body.message);

    if (!name || !email || !phone) {
      return res.status(400).json({ error: 'Name, email, and phone are required.' });
    }

    const html = `
      <div style="font-family:Arial,Helvetica,sans-serif;line-height:1.6;color:#111827;max-width:680px;margin:auto;">
        <h2 style="color:#0b1f33;">New Florida Mutual Mortgage Lead</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Loan Interest:</strong> ${loanType || 'Not selected'}</p>
        <p><strong>Message:</strong></p>
        <div style="padding:16px;background:#f3f6f8;border-radius:12px;">${message || 'No message provided.'}</div>
        <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;">
        <p style="font-size:13px;color:#6b7280;">Submitted from the Florida Mutual Mortgage website.</p>
      </div>
    `;

    await resend.emails.send({
      from: 'Florida Mutual <onboarding@resend.dev>',
     to: ['pagoagagus@gmail.com'],
      replyTo: email,
      subject: `New Mortgage Lead: ${name}`,
      html
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Contact form error:', error);
    return res.status(500).json({ error: 'Could not send message right now.' });
  }
}
