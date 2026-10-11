import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const targetEmail = body.email || process.env.OWNER_EMAIL || 'Yezbeefashion@gmail.com';

    const smtpEmail = process.env.SMTP_EMAIL;
    const smtpPassword = process.env.SMTP_PASSWORD;

    if (!smtpEmail || !smtpPassword || smtpPassword === 'your_gmail_app_password_here') {
      return NextResponse.json(
        {
          success: false,
          message: 'Gmail App Password is not configured in .env.local (SMTP_PASSWORD is missing or set to placeholder).',
          configured: false,
        },
        { status: 400 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: smtpEmail,
        pass: smtpPassword.replace(/\s+/g, ''),
      },
    });

    await transporter.verify();

    await transporter.sendMail({
      from: `"YEZ BEE Store" <${smtpEmail}>`,
      to: targetEmail,
      subject: '✅ YEZ BEE Store - Email Notification Test Successful!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 550px; margin: 0 auto; padding: 25px; border: 1px solid #e0e0e0; border-radius: 12px;">
          <h2 style="color: #C9A84C; margin-top: 0;">🎉 Automated Email Notifications Working!</h2>
          <p style="color: #333; line-height: 1.6;">
            This is a verification test from your <strong>YEZ BEE Luxury E-commerce Store</strong>.
          </p>
          <div style="background: #FAF7F2; padding: 15px; border-radius: 8px; border-left: 4px solid #C9A84C; margin: 15px 0;">
            <p style="margin: 0; color: #8C6D23; font-size: 13px; font-weight: bold;">
              ✅ Gmail SMTP is fully authenticated and ready.
            </p>
            <p style="margin: 5px 0 0; color: #555; font-size: 12px;">
              Whenever a customer places an order (COD or Online Payment), you will automatically receive full order details instantly here.
            </p>
          </div>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 11px; color: #888; margin: 0;">
            Timestamp: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST
          </p>
        </div>
      `,
    });

    return NextResponse.json({
      success: true,
      message: `Test email sent successfully to ${targetEmail}!`,
    });
  } catch (err: any) {
    console.error('Test email error:', err);
    return NextResponse.json(
      {
        success: false,
        message: err.message || 'SMTP Authentication failed. Please check your Gmail App Password.',
      },
      { status: 500 }
    );
  }
}
