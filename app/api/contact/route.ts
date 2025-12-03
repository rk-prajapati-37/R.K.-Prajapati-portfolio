import nodemailer from 'nodemailer';
import type { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, mobile, message } = body;

    // Require name and message, and at least one contact: email or mobile
    if (!name || !message) {
      return new Response(JSON.stringify({ error: 'Missing required fields: name and message' }), { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobileClean = mobile ? String(mobile).replace(/\s|-/g, "") : "";
    const mobileValid = mobileClean && /^\d{7,15}$/.test(mobileClean);
    const emailValid = email && emailRegex.test(String(email));

    if (!emailValid && !mobileValid) {
      return new Response(JSON.stringify({ error: 'Provide a valid email or mobile number' }), { status: 400 });
    }

    // Prepare email
    const recipients = [
      'r.k.prajapati0307@gmail.com',
    ];

    // Read SMTP credentials from env
    const host = process.env.SMTP_HOST;
    const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (!host || !user || !pass) {
      // If SMTP not configured, save to backend MongoDB
      console.warn('SMTP not configured. Attempting to save to backend...');
      try {
        const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000';
        const backendRes = await fetch(`${backendUrl}/api/contact`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        const backendData = await backendRes.json();
        if (backendRes.ok) {
          return new Response(JSON.stringify({ message: 'Message saved successfully!' }), { status: 200 });
        }
      } catch (backendErr) {
        console.error('Backend save failed:', backendErr);
      }
      // Fallback: just acknowledge receipt
      return new Response(JSON.stringify({ message: 'Message received. We will contact you soon!' }), { status: 200 });
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465, // true for 465, false for other ports
      auth: {
        user,
        pass,
      },
    });

    const mailOptions = {
      from: `${name} <${email}>`,
      to: recipients.join(','),
      subject: `New contact form message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nMobile: ${mobile || 'N/A'}\n\nMessage:\n${message}`,
      html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Mobile:</strong> ${mobile || 'N/A'}</p><hr/><p>${message.replace(/\n/g, '<br/>')}</p>`,
    } as any;

    await transporter.sendMail(mailOptions);

    return new Response(JSON.stringify({ message: 'Message sent successfully.' }), { status: 200 });
  } catch (err: any) {
    console.error('Contact API error:', err);
    return new Response(JSON.stringify({ error: err?.message || 'Server error' }), { status: 500 });
  }
}
