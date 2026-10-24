const nodemailer = require('nodemailer');

// Transporter with fallback
let transporter;

const initTransporter = () => {
  if (
    process.env.SMTP_HOST &&
    process.env.SMTP_HOST !== 'smtp.ethereal.email' &&
    process.env.SMTP_USER &&
    process.env.SMTP_USER !== 'mock@ethereal.email'
  ) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  } else {
    // Console log fallback transporter
    transporter = {
      sendMail: async (options) => {
        console.log('\n=================== [MOCK EMAIL SENT] ===================');
        console.log(`To: ${options.to}`);
        console.log(`Subject: ${options.subject}`);
        console.log(`Preview Text / BodySnippet:`);
        console.log(options.text || options.html.replace(/<[^>]*>?/gm, '').substring(0, 200));
        console.log('=========================================================\n');
        return { messageId: `mock-email-${Date.now()}` };
      },
    };
  }
};

initTransporter();

const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const from = process.env.FROM_EMAIL || '"LuxeLoom Fine Jewellery" <no-reply@luxeloom.com>';
    const info = await transporter.sendMail({
      from,
      to,
      subject,
      text: text || subject,
      html,
    });
    return info;
  } catch (error) {
    console.error('[Email Service Error]', error.message);
    return null;
  }
};

const sendWelcomeEmail = async (user) => {
  const html = `
    <div style="font-family: Arial, sans-serif; background-color: #FAF8F5; padding: 40px 20px; color: #18181B;">
      <div style="max-width: 600px; margin: 0 auto; background: #FFFFFF; border: 1px solid #E5E0D8; border-radius: 8px; overflow: hidden; padding: 30px;">
        <div style="text-align: center; border-bottom: 2px solid #C5A059; padding-bottom: 20px;">
          <h1 style="color: #C5A059; margin: 0; font-size: 28px; letter-spacing: 2px;">LUXELOOM</h1>
          <p style="color: #71717A; font-size: 12px; text-transform: uppercase; letter-spacing: 3px; margin-top: 4px;">Fine Jewellery Collection</p>
        </div>
        <div style="padding: 20px 0;">
          <h2 style="color: #18181B; font-weight: 400;">Welcome to LuxeLoom, ${user.name}!</h2>
          <p>Thank you for registering with LuxeLoom. Discover our timeless collection of certified 24K, 22K, 18K Gold and 925 Sterling Silver jewellery priced with live transparent market rates.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}" style="background-color: #C5A059; color: #FFFFFF; text-decoration: none; padding: 12px 28px; border-radius: 4px; font-weight: bold; display: inline-block;">Explore Collection</a>
          </div>
        </div>
        <div style="border-top: 1px solid #F4F4F5; padding-top: 15px; text-align: center; font-size: 12px; color: #A1A1AA;">
          <p>&copy; ${new Date().getFullYear()} LuxeLoom Fine Jewellery. All rights reserved.</p>
        </div>
      </div>
    </div>
  `;
  return sendEmail({ to: user.email, subject: 'Welcome to LuxeLoom Fine Jewellery', html });
};

const sendOrderConfirmationEmail = async (user, order) => {
  const itemsHtml = order.items
    .map(
      (item) => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #E4E4E7;">
        <strong>${item.name}</strong><br/>
        <small style="color: #71717A;">${item.metalType} (${item.purity}) | Weight: ${item.weight}g</small>
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #E4E4E7; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #E4E4E7; text-align: right;">₹${item.totalItemPrice.toLocaleString('en-IN')}</td>
    </tr>
  `
    )
    .join('');

  const html = `
    <div style="font-family: Arial, sans-serif; background-color: #FAF8F5; padding: 40px 20px; color: #18181B;">
      <div style="max-width: 600px; margin: 0 auto; background: #FFFFFF; border: 1px solid #E5E0D8; border-radius: 8px; padding: 30px;">
        <div style="text-align: center; border-bottom: 2px solid #C5A059; padding-bottom: 20px;">
          <h1 style="color: #C5A059; margin: 0; font-size: 26px;">LUXELOOM</h1>
          <p style="color: #16A34A; font-weight: bold; margin-top: 10px;">✓ ORDER CONFIRMED (#${order.orderId})</p>
        </div>
        <div style="padding: 20px 0;">
          <p>Dear ${user.name || 'Valued Customer'},</p>
          <p>We are delighted to confirm your order! Your luxury jewellery items are being processed for secure dispatch.</p>
          
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <thead>
              <tr style="background-color: #F4F4F5; text-align: left;">
                <th style="padding: 10px;">Item</th>
                <th style="padding: 10px; text-align: center;">Qty</th>
                <th style="padding: 10px; text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <div style="background: #FAF8F5; padding: 15px; border-radius: 6px; margin-top: 20px;">
            <p style="margin: 4px 0;"><strong>Subtotal (Metal + Charges):</strong> ₹${order.subtotal.toLocaleString('en-IN')}</p>
            <p style="margin: 4px 0;"><strong>GST (3%):</strong> ₹${order.gst.toLocaleString('en-IN')}</p>
            <p style="margin: 4px 0;"><strong>Delivery:</strong> ${order.deliveryCharges === 0 ? 'FREE' : `₹${order.deliveryCharges}`}</p>
            <h3 style="color: #C5A059; margin-top: 10px; border-top: 1px solid #E5E0D8; padding-top: 10px;">Grand Total: ₹${order.totalAmount.toLocaleString('en-IN')}</h3>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/order-tracking/${order.orderId}" style="background-color: #18181B; color: #FFFFFF; text-decoration: none; padding: 12px 28px; border-radius: 4px; font-weight: bold; display: inline-block;">Track Delivery Status</a>
          </div>
        </div>
      </div>
    </div>
  `;
  return sendEmail({ to: user.email, subject: `Order Confirmed - #${order.orderId} | LuxeLoom`, html });
};

const sendOrderStatusEmail = async (user, order, status) => {
  const html = `
    <div style="font-family: Arial, sans-serif; background-color: #FAF8F5; padding: 30px 20px;">
      <div style="max-width: 600px; margin: 0 auto; background: #FFFFFF; border: 1px solid #E5E0D8; padding: 25px; border-radius: 8px;">
        <h2 style="color: #C5A059;">LuxeLoom Order Status Update</h2>
        <p>Your order <strong>#${order.orderId}</strong> status has been updated to: <span style="color: #2563EB; font-weight: bold;">${status}</span></p>
        <p>You can track real-time delivery coordinates on our live tracking page.</p>
        <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/order-tracking/${order.orderId}" style="background: #C5A059; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block; margin-top: 15px;">View Live Map Tracking</a>
      </div>
    </div>
  `;
  return sendEmail({ to: user.email, subject: `Order #${order.orderId} Update: ${status}`, html });
};

module.exports = {
  sendEmail,
  sendWelcomeEmail,
  sendOrderConfirmationEmail,
  sendOrderStatusEmail,
};
