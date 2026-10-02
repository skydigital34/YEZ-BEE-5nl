import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Owner Email and Phone Details
const OWNER_EMAIL = process.env.OWNER_EMAIL || 'Yezbeefashion@gmail.com';
const OWNER_PHONE = process.env.OWNER_PHONE || '919876543210';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { orderId, items, shippingAddress, totalAmount, paymentMethod } = body;

    const customerName = `${shippingAddress?.firstName || ''} ${shippingAddress?.lastName || ''}`.trim() || 'Valued Customer';
    const customerEmail = shippingAddress?.email;
    const customerPhone = shippingAddress?.phone || 'N/A';
    const address = `${shippingAddress?.address1 || ''}, ${shippingAddress?.city || ''} - ${shippingAddress?.pincode || ''}`;

    // Format Product Details List
    const productsListHtml = items?.map((item: any) => `
      <tr style="border-bottom: 1px solid #eee;">
        <td style="padding: 10px;">${item.name} ${item.size ? `(Size: ${item.size})` : ''}</td>
        <td style="padding: 10px; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; text-align: right;">₹${(item.price * item.quantity).toLocaleString()}</td>
      </tr>
    `).join('') || '';

    const productsListText = items?.map((item: any) => 
      `- ${item.name} ${item.size ? `(${item.size})` : ''} x ${item.quantity} = ₹${(item.price * item.quantity).toLocaleString()}`
    ).join('\n') || '';

    // Config SMTP Transporter (Nodemailer)
    const smtpEmail = process.env.SMTP_EMAIL;
    const smtpPassword = process.env.SMTP_PASSWORD;

    if (smtpEmail && smtpPassword) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: smtpEmail,
          pass: smtpPassword,
        },
      });

      // 1️⃣ SEND EMAIL TO OWNER / ADMIN
      await transporter.sendMail({
        from: `"YEZ BEE Store" <${smtpEmail}>`,
        to: OWNER_EMAIL,
        subject: `🚨 NEW ORDER RECEIVED! #${orderId || Date.now()}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
            <h2 style="color: #C9A84C; margin-top: 0;">🎉 New Customer Order Placed</h2>
            <p><strong>Order ID:</strong> ${orderId || 'N/A'}</p>
            <p><strong>Total Amount:</strong> ₹${totalAmount?.toLocaleString()}</p>
            <p><strong>Payment Method:</strong> ${paymentMethod}</p>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />

            <h3 style="color: #333;">Customer Information:</h3>
            <p><strong>Name:</strong> ${customerName}</p>
            <p><strong>Phone:</strong> ${customerPhone}</p>
            <p><strong>Email:</strong> ${customerEmail}</p>
            <p><strong>Address:</strong> ${address}</p>

            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />

            <h3 style="color: #333;">Products Ordered:</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="background: #f8f8f8; text-align: left;">
                  <th style="padding: 10px;">Item</th>
                  <th style="padding: 10px; text-align: center;">Qty</th>
                  <th style="padding: 10px; text-align: right;">Price</th>
                </tr>
              </thead>
              <tbody>
                ${productsListHtml}
              </tbody>
            </table>
          </div>
        `,
      });

      // 2️⃣ SEND EMAIL TO CUSTOMER (IF EMAIL PROVIDED)
      if (customerEmail) {
        await transporter.sendMail({
          from: `"YEZ BEE Luxury" <${smtpEmail}>`,
          to: customerEmail,
          subject: `✨ Order Confirmation - YEZ BEE #${orderId || Date.now()}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
              <h2 style="color: #C9A84C; margin-top: 0;">Thank You for Your Order, ${customerName}!</h2>
              <p>We have successfully received your order and are processing it for shipment.</p>
              
              <h3 style="color: #333;">Order Summary</h3>
              <p><strong>Total Paid:</strong> ₹${totalAmount?.toLocaleString()}</p>
              <p><strong>Shipping Address:</strong> ${address}</p>

              <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
                <thead>
                  <tr style="background: #f8f8f8; text-align: left;">
                    <th style="padding: 10px;">Item</th>
                    <th style="padding: 10px; text-align: center;">Qty</th>
                    <th style="padding: 10px; text-align: right;">Price</th>
                  </tr>
                </thead>
                <tbody>
                  ${productsListHtml}
                </tbody>
              </table>

              <p style="margin-top: 30px; font-size: 12px; color: #777;">If you have any questions, please contact our atelier support team.</p>
            </div>
          `,
        });
      }
    }

    // 3️⃣ GENERATE WHATSAPP MESSAGE TEXT FOR OWNER & CUSTOMER
    const ownerWhatsAppText = encodeURIComponent(
      `🛍️ *NEW ORDER RECEIVED - YEZ BEE*\n\n` +
      `👤 *Customer:* ${customerName}\n` +
      `📞 *Phone:* ${customerPhone}\n` +
      `📍 *Address:* ${address}\n\n` +
      `📦 *Items Ordered:*\n${productsListText}\n\n` +
      `💰 *Total Amount:* ₹${totalAmount?.toLocaleString()}\n` +
      `💳 *Payment:* ${paymentMethod}`
    );

    const ownerWhatsAppLink = `https://wa.me/${OWNER_PHONE}?text=${ownerWhatsAppText}`;

    return NextResponse.json({
      success: true,
      message: 'Notifications generated successfully',
      whatsapp: {
        ownerLink: ownerWhatsAppLink,
        messageText: productsListText,
      }
    });

  } catch (error: any) {
    console.error('Error sending order notification:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to send notification' },
      { status: 500 }
    );
  }
}
