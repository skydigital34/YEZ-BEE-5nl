import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { formatNumericOrderId } from '@/lib/utils';

// Owner Email and Phone Details
const OWNER_EMAIL = process.env.OWNER_EMAIL || 'Yezbeefashion@gmail.com';
const OWNER_PHONE = process.env.OWNER_PHONE || '919876543210';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { orderId, items, shippingAddress, totalAmount, paymentMethod, paymentStatus } = body;
    const cleanOrderId = formatNumericOrderId(orderId);

    const customerName = `${shippingAddress?.firstName || ''} ${shippingAddress?.lastName || ''}`.trim() || 'Valued Customer';
    const customerEmail = shippingAddress?.email;
    const customerPhone = shippingAddress?.phone || 'N/A';
    const address = `${shippingAddress?.address1 || ''}${shippingAddress?.address2 ? ', ' + shippingAddress.address2 : ''}, ${shippingAddress?.city || ''}, ${shippingAddress?.state || ''} - ${shippingAddress?.pincode || ''}`;

    // Format Product Details List HTML
    const productsListHtml = (items || []).map((item: any) => `
      <tr style="border-bottom: 1px solid #eee;">
        <td style="padding: 12px; font-size: 13px; color: #333;">
          <strong>${item.name}</strong>
          ${item.size ? `<br/><span style="color: #777; font-size: 11px;">Size: ${item.size}</span>` : ''}
          ${item.color ? `<span style="color: #777; font-size: 11px;"> | Color: ${item.color}</span>` : ''}
        </td>
        <td style="padding: 12px; text-align: center; font-size: 13px; color: #555;">${item.quantity || 1}</td>
        <td style="padding: 12px; text-align: right; font-size: 13px; color: #111; font-weight: bold;">₹${((item.price || 0) * (item.quantity || 1)).toLocaleString()}</td>
      </tr>
    `).join('');

    const productsListText = (items || []).map((item: any) => 
      `- ${item.name} ${item.size ? `(${item.size})` : ''} x ${item.quantity || 1} = ₹${((item.price || 0) * (item.quantity || 1)).toLocaleString()}`
    ).join('\n');

    // Config SMTP Transporter (Nodemailer)
    const smtpEmail = process.env.SMTP_EMAIL;
    const smtpPassword = process.env.SMTP_PASSWORD;

    const isSmtpConfigured = smtpEmail && smtpPassword && smtpPassword !== 'your_gmail_app_password_here';

    let emailSentToOwner = false;
    let emailSentToCustomer = false;
    let emailError: string | null = null;

    if (isSmtpConfigured) {
      try {
        const transporter = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 465,
          secure: true,
          auth: {
            user: smtpEmail,
            pass: smtpPassword.replace(/\s+/g, ''),
          },
        });

        // 1️⃣ SEND EMAIL TO OWNER / ADMIN
        await transporter.sendMail({
          from: `"YEZ BEE Store Orders" <${smtpEmail}>`,
          to: OWNER_EMAIL,
          subject: `🚨 NEW ORDER RECEIVED! #${cleanOrderId} - ₹${(totalAmount || 0).toLocaleString()}`,
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 620px; margin: 0 auto; padding: 24px; border: 1px solid #e8e2d5; border-radius: 12px; background-color: #ffffff;">
              <div style="text-align: center; padding-bottom: 20px; border-bottom: 2px solid #C9A84C;">
                <h1 style="color: #1A1A1A; margin: 0; font-size: 24px; letter-spacing: 2px;">YEZ BEE</h1>
                <p style="color: #C9A84C; font-size: 13px; font-weight: bold; margin: 4px 0 0; text-transform: uppercase;">New Order Alert</p>
              </div>

              <div style="background-color: #FAF7F2; padding: 16px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #C9A84C;">
                <p style="margin: 0; font-size: 16px; font-weight: bold; color: #1A1A1A;">Order #${cleanOrderId}</p>
                <p style="margin: 4px 0 0; font-size: 14px; color: #555;">Total Amount: <strong style="color: #1A1A1A; font-size: 16px;">₹${(totalAmount || 0).toLocaleString()}</strong></p>
                <p style="margin: 4px 0 0; font-size: 12px; color: #666;">Payment: <strong style="color: ${paymentStatus === 'paid' ? '#16a34a' : '#d97706'};">${paymentMethod || 'Online / COD'}</strong></p>
              </div>

              <h3 style="color: #1A1A1A; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">Customer Details</h3>
              <table style="width: 100%; font-size: 13px; margin-bottom: 20px;">
                <tr><td style="color: #666; width: 120px; padding: 4px 0;">Name:</td><td style="color: #1A1A1A; font-weight: 600;">${customerName}</td></tr>
                <tr><td style="color: #666; padding: 4px 0;">Mobile Phone:</td><td style="color: #1A1A1A; font-weight: 600;"><a href="tel:${customerPhone}" style="color: #C9A84C; text-decoration: none;">${customerPhone}</a></td></tr>
                <tr><td style="color: #666; padding: 4px 0;">Email:</td><td style="color: #1A1A1A;">${customerEmail || 'Not provided'}</td></tr>
                <tr><td style="color: #666; padding: 4px 0; vertical-align: top;">Delivery Address:</td><td style="color: #1A1A1A; line-height: 1.4;">${address}</td></tr>
              </table>

              <h3 style="color: #1A1A1A; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">Ordered Items</h3>
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                <thead>
                  <tr style="background-color: #FAF7F2; text-align: left; font-size: 11px; text-transform: uppercase; color: #666;">
                    <th style="padding: 10px;">Item Details</th>
                    <th style="padding: 10px; text-align: center;">Qty</th>
                    <th style="padding: 10px; text-align: right;">Price</th>
                  </tr>
                </thead>
                <tbody>
                  ${productsListHtml}
                </tbody>
              </table>

              <div style="text-align: right; border-top: 1px solid #eee; padding-top: 12px; font-size: 15px;">
                <strong>Grand Total: ₹${(totalAmount || 0).toLocaleString()}</strong>
              </div>

              <div style="margin-top: 25px; padding: 14px; background-color: #f8f8f8; border-radius: 8px; text-align: center; font-size: 12px; color: #777;">
                View this order in your <a href="https://yezbee.com/admin/orders/${cleanOrderId}" style="color: #C9A84C; font-weight: bold; text-decoration: underline;">Admin Portal &rarr;</a>
              </div>
            </div>
          `,
        });
        emailSentToOwner = true;

        // 2️⃣ SEND EMAIL TO CUSTOMER (IF EMAIL PROVIDED)
        if (customerEmail) {
          await transporter.sendMail({
            from: `"YEZ BEE" <${smtpEmail}>`,
            to: customerEmail,
            subject: `✨ Order Confirmation - YEZ BEE #${cleanOrderId}`,
            html: `
              <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e8e2d5; border-radius: 12px; background-color: #ffffff;">
                <div style="text-align: center; padding-bottom: 20px; border-bottom: 2px solid #C9A84C;">
                  <h1 style="color: #1A1A1A; margin: 0; font-size: 24px; letter-spacing: 2px;">YEZ BEE</h1>
                  <p style="color: #C9A84C; font-size: 13px; font-weight: bold; margin: 4px 0 0; text-transform: uppercase;">Atelier Confirmation</p>
                </div>

                <div style="padding: 20px 0; text-align: center;">
                  <h2 style="color: #1A1A1A; margin: 0; font-size: 20px;">Thank you for your order, ${customerName}!</h2>
                  <p style="color: #666; font-size: 13px; margin: 8px 0 0; line-height: 1.5;">
                    Your order <strong>#${cleanOrderId}</strong> has been received and is being prepared with utmost care.
                  </p>
                </div>

                <div style="background-color: #FAF7F2; padding: 14px 18px; border-radius: 8px; margin-bottom: 20px;">
                  <table style="width: 100%; font-size: 13px;">
                    <tr><td style="color: #666;">Order Number:</td><td style="color: #1A1A1A; font-weight: bold; text-align: right;">#${cleanOrderId}</td></tr>
                    <tr><td style="color: #666;">Total Paid:</td><td style="color: #1A1A1A; font-weight: bold; text-align: right;">₹${(totalAmount || 0).toLocaleString()}</td></tr>
                    <tr><td style="color: #666;">Shipping Address:</td><td style="color: #1A1A1A; text-align: right;">${address}</td></tr>
                  </table>
                </div>

                <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                  <thead>
                    <tr style="background-color: #FAF7F2; text-align: left; font-size: 11px; text-transform: uppercase; color: #666;">
                      <th style="padding: 10px;">Item</th>
                      <th style="padding: 10px; text-align: center;">Qty</th>
                      <th style="padding: 10px; text-align: right;">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${productsListHtml}
                  </tbody>
                </table>

                <p style="margin-top: 24px; font-size: 12px; color: #777; text-align: center; line-height: 1.5;">
                  We will notify you with tracking details as soon as your parcel is dispatched.<br/>
                  For any inquiries, contact our team at <a href="mailto:${OWNER_EMAIL}" style="color: #C9A84C;">${OWNER_EMAIL}</a>.
                </p>
              </div>
            `,
          });
          emailSentToCustomer = true;
        }
      } catch (err: any) {
        console.error('[Notifications] Failed to send email via SMTP:', err);
        emailError = err?.message || 'SMTP send failed';
      }
    } else {
      console.warn('[Notifications] SMTP_PASSWORD is not set in .env.local. Email dispatch skipped.');
    }

    // 3️⃣ GENERATE WHATSAPP MESSAGE LINK FOR OWNER
    const ownerWhatsAppText = encodeURIComponent(
      `🛍️ *NEW ORDER RECEIVED - YEZ BEE*\n\n` +
      `🧾 *Order ID:* #${cleanOrderId}\n` +
      `👤 *Customer:* ${customerName}\n` +
      `📞 *Phone:* ${customerPhone}\n` +
      `📍 *Address:* ${address}\n\n` +
      `📦 *Items:*\n${productsListText}\n\n` +
      `💰 *Total Amount:* ₹${(totalAmount || 0).toLocaleString()}\n` +
      `💳 *Payment:* ${paymentMethod || 'Online / COD'}`
    );

    const ownerWhatsAppLink = `https://wa.me/${OWNER_PHONE}?text=${ownerWhatsAppText}`;

    return NextResponse.json({
      success: true,
      message: emailSentToOwner ? 'Notifications sent successfully to owner and customer' : 'Order notification processed',
      emailSentToOwner,
      emailSentToCustomer,
      emailConfigured: Boolean(isSmtpConfigured),
      emailError,
      whatsapp: {
        ownerLink: ownerWhatsAppLink,
        messageText: productsListText,
      }
    });

  } catch (error: any) {
    console.error('Error processing order notification:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to process notification' },
      { status: 500 }
    );
  }
}
