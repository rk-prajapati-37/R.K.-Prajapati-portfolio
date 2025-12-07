import nodemailer from 'nodemailer';
import type { NextRequest } from 'next/server';

/**
 * POST /api/contact
 * Handles contact form submissions:
 * 1. Validates form data
 * 2. Saves to MongoDB (via backend API)
 * 3. Sends email notification to admin
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, mobile, message } = body;

    // ========== VALIDATION ==========
    if (!name || !message) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: name and message' }),
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobileClean = mobile ? String(mobile).replace(/\s|-/g, '') : '';
    const mobileValid = mobileClean && /^\d{7,15}$/.test(mobileClean);
    const emailValid = email && emailRegex.test(String(email));

    // Require BOTH contact methods: email AND mobile
    if (!emailValid || !mobileValid) {
      return new Response(
        JSON.stringify({ error: 'Please provide a valid email address AND a valid mobile number' }),
        { status: 400 }
      );
    }

    // ========== SAVE TO DATABASE ==========
    let dbSaveSuccess = false;
    try {
      const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000';
      const backendRes = await fetch(`${backendUrl}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (backendRes.ok) {
        dbSaveSuccess = true;
        console.log('✅ Contact saved to MongoDB');
      } else {
        console.error('❌ Backend save failed:', await backendRes.text());
      }
    } catch (backendErr) {
      console.error('⚠️ Backend connection error:', backendErr);
      // Continue anyway - try to send email
    }

    // ========== SEND EMAIL NOTIFICATION ==========
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const contactEmailRecipient = process.env.CONTACT_EMAIL_RECIPIENT || 'r.k.prajapati0307@gmail.com';

    if (!smtpHost || !smtpUser || !smtpPass) {
      // SMTP not configured - just return success if DB saved
      if (dbSaveSuccess) {
        return new Response(
          JSON.stringify({ message: 'Message saved successfully! (Email notification not configured)' }),
          { status: 200 }
        );
      } else {
        return new Response(
          JSON.stringify({ error: 'Email service not configured and database save failed' }),
          { status: 500 }
        );
      }
    }

    // ========== CREATE EMAIL TRANSPORTER ==========
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465, // true for 465, false for other ports
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    // ========== EMAIL TEMPLATE FOR ADMIN ==========
    const adminMailOptions = {
      from: smtpUser,
      to: contactEmailRecipient,
      subject: `📬 New Contact Form Submission`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #ef4444; padding-bottom: 10px;">
            🎉 New Contact Form Submission
          </h2>
          
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Mobile:</strong> ${mobile}</p>
            <p><strong>Message:</strong></p>
            <p style="background: white; padding: 10px; border-left: 4px solid #ef4444;">
              ${message.replace(/\n/g, '<br />')}
            </p>
          </div>

          <div style="background: #f0f0f0; padding: 15px; border-radius: 8px; font-size: 12px; color: #666;">
            <p>📅 Received at: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
            <p>✅ Status: ${dbSaveSuccess ? 'Saved to MongoDB' : 'Not saved to DB'}</p>
          </div>

          <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
          <p style="color: #999; font-size: 12px;">
            This is an automated message. Reply to ${email || 'the user (no email provided)'} to respond.
          </p>
        </div>
      `,
    };

    // ========== EMAIL TEMPLATE FOR USER ==========
    const userMailOptions = email
      ? {
          from: smtpUser,
          to: email,
          subject: '✅ We received your message!',
          html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Thank you for reaching out${name ? ', ' + name : ''}!</h2>
          
          <p>We've received your message and will get back to you as soon as possible.</p>
          
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Your Message:</strong></p>
            <p style="background: white; padding: 10px; border-left: 4px solid #ef4444;">
              ${message.replace(/\n/g, '<br />')}
            </p>
          </div>

          <div style="background: #e8f5e9; padding: 15px; border-radius: 8px;">
            <p style="color: #2e7d32; margin: 0;">
              <strong>✓ Your submission has been confirmed</strong>
            </p>
          </div>

          <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
          <p style="color: #999; font-size: 12px;">
            Reply-To: ${email}
          </p>
        </div>
      `,
        }
      : null;

    try {
      // Send email to admin
      await transporter.sendMail(adminMailOptions);
      console.log('✅ Admin notification email sent');

      // Send confirmation email to user (only if email provided)
      if (emailValid && userMailOptions) {
        await transporter.sendMail(userMailOptions as any);
        console.log('✅ User confirmation email sent');
      }

      return new Response(
        JSON.stringify({
          message: 'Message received! We will contact you soon. Check your email for confirmation.',
          success: true,
        }),
        { status: 200 }
      );
    } catch (emailErr) {
      console.error('⚠️ Email sending failed:', emailErr);

      // Even if email fails, if DB saved, return success
      if (dbSaveSuccess) {
        return new Response(
          JSON.stringify({
            message: 'Message saved! (Email notification failed, but we have your details)',
            success: true,
          }),
          { status: 200 }
        );
      } else {
        return new Response(
          JSON.stringify({ error: 'Failed to process your message. Please try again.' }),
          { status: 500 }
        );
      }
    }
  } catch (err: any) {
    console.error('❌ Contact API error:', err);
    return new Response(
      JSON.stringify({ error: err?.message || 'Server error' }),
      { status: 500 }
    );
  }
}
