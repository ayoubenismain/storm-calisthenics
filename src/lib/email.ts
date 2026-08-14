import nodemailer from "nodemailer";

interface SendEmailParams {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  receiverEmail?: string;
}

export interface SendOrderEmailParams {
  orderNumber: string;
  customerName: string;
  phone: string;
  email?: string;
  city: string;
  address: string;
  notes?: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    image?: string;
  }>;
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod?: string;
  currency?: string;
}

export function createTransporter() {
  const user = process.env.GMAIL_USER || process.env.SMTP_USER;
  const pass = process.env.GMAIL_APP_PASSWORD || process.env.SMTP_PASS;
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = parseInt(process.env.SMTP_PORT || "465", 10);
  const secure = port === 465;

  if (!user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
  });
}

// Helper to check if an email is a placeholder/invalid test domain
const isPlaceholderEmail = (emailStr?: string) => {
  if (!emailStr) return true;
  const lower = emailStr.toLowerCase().trim();
  return (
    lower.endsWith("@stormbarz.com") ||
    lower.endsWith("@storm.com") ||
    lower.endsWith("@example.com")
  );
};

export function getAdminNotificationEmailHtml({
  name,
  email,
  phone,
  subject,
  message,
  date,
}: {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  date: string;
}) {
  return `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Contact Message - STORM Calisthenics</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #0a0a0c; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #e4e4e7;">
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0a0a0c; padding: 40px 10px;">
        <tr>
          <td align="center">
            <table width="100%" max-width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #141417; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);">
              
              <!-- Header -->
              <tr>
                <td style="padding: 32px; background: linear-gradient(180deg, #1c1c22 0%, #141417 100%); border-bottom: 1px solid rgba(255, 255, 255, 0.08); text-align: center;">
                  <h1 style="margin: 0; font-size: 28px; font-weight: 900; letter-spacing: -1px; color: #ffffff;">STORM</h1>
                  <p style="margin: 6px 0 0 0; font-size: 11px; text-transform: uppercase; letter-spacing: 3px; color: #007aff; font-weight: 600;">NEW CONTACT INQUIRY</p>
                </td>
              </tr>

              <!-- Body Content -->
              <tr>
                <td style="padding: 32px;">
                  <p style="margin: 0 0 24px 0; font-size: 15px; color: #a1a1aa; line-height: 1.6;">
                    You have received a new contact message from the website contact form.
                  </p>

                  <!-- Sender Details Card -->
                  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0d0d0f; border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 12px; margin-bottom: 24px;">
                    <tr>
                      <td style="padding: 20px;">
                        <table width="100%" border="0" cellspacing="0" cellpadding="6">
                          <tr>
                            <td width="110" style="font-size: 12px; font-weight: 700; text-transform: uppercase; color: #71717a;">Sender:</td>
                            <td style="font-size: 14px; font-weight: 600; color: #ffffff;">${name}</td>
                          </tr>
                          <tr>
                            <td style="font-size: 12px; font-weight: 700; text-transform: uppercase; color: #71717a;">Email:</td>
                            <td style="font-size: 14px; color: #007aff;"><a href="mailto:${email}" style="color: #007aff; text-decoration: none;">${email}</a></td>
                          </tr>
                          ${
                            phone
                              ? `<tr>
                            <td style="font-size: 12px; font-weight: 700; text-transform: uppercase; color: #71717a;">Phone:</td>
                            <td style="font-size: 14px; color: #ffffff;">${phone}</td>
                          </tr>`
                              : ""
                          }
                          ${
                            subject
                              ? `<tr>
                            <td style="font-size: 12px; font-weight: 700; text-transform: uppercase; color: #71717a;">Subject:</td>
                            <td style="font-size: 14px; color: #ffffff;">${subject}</td>
                          </tr>`
                              : ""
                          }
                          <tr>
                            <td style="font-size: 12px; font-weight: 700; text-transform: uppercase; color: #71717a;">Received:</td>
                            <td style="font-size: 13px; color: #a1a1aa;">${date}</td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>

                  <!-- Message Content -->
                  <div style="margin-bottom: 24px;">
                    <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #71717a; margin-bottom: 8px;">Message:</div>
                    <div style="background-color: #0d0d0f; border-left: 3px solid #007aff; padding: 18px; border-radius: 0 12px 12px 0; font-size: 15px; line-height: 1.7; color: #e4e4e7; white-space: pre-wrap;">${message}</div>
                  </div>

                  <!-- CTA Button -->
                  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top: 28px;">
                    <tr>
                      <td align="center">
                        <a href="mailto:${email}?subject=${encodeURIComponent("Re: " + (subject || "Your inquiry with STORM Calisthenics"))}" style="display: inline-block; padding: 14px 28px; background-color: #ffffff; color: #0a0a0c; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; text-decoration: none; border-radius: 8px; box-shadow: 0 4px 12px rgba(255, 255, 255, 0.15);">
                          Reply to ${name}
                        </a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="padding: 24px 32px; background-color: #0d0d0f; border-top: 1px solid rgba(255, 255, 255, 0.06); text-align: center;">
                  <p style="margin: 0; font-size: 12px; color: #52525b;">STORM Calisthenics Automated Notification System</p>
                  <p style="margin: 4px 0 0 0; font-size: 11px; color: #3f3f46;">Built for performance. Tested in the storm.</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
  `;
}

export function getCustomerConfirmationEmailHtml({
  name,
  message,
}: {
  name: string;
  message: string;
}) {
  return `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>We Received Your Message - STORM Calisthenics</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #0a0a0c; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #e4e4e7;">
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0a0a0c; padding: 40px 10px;">
        <tr>
          <td align="center">
            <table width="100%" max-width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #141417; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);">
              
              <!-- Header -->
              <tr>
                <td style="padding: 36px 32px; background: linear-gradient(180deg, #1c1c22 0%, #141417 100%); border-bottom: 1px solid rgba(255, 255, 255, 0.08); text-align: center;">
                  <h1 style="margin: 0; font-size: 32px; font-weight: 900; letter-spacing: -1.5px; color: #ffffff;">STORM</h1>
                  <p style="margin: 8px 0 0 0; font-size: 12px; text-transform: uppercase; letter-spacing: 4px; color: #007aff; font-weight: 700;">BECOME THE STORM</p>
                </td>
              </tr>

              <!-- Body Content -->
              <tr>
                <td style="padding: 36px 32px;">
                  <h2 style="margin: 0 0 16px 0; font-size: 20px; font-weight: 700; color: #ffffff;">Hello ${name},</h2>
                  <p style="margin: 0 0 20px 0; font-size: 15px; color: #a1a1aa; line-height: 1.7;">
                    Thank you for reaching out to <strong style="color: #ffffff;">STORM Calisthenics</strong>. We have received your message and our team is reviewing it.
                  </p>
                  <p style="margin: 0 0 28px 0; font-size: 15px; color: #a1a1aa; line-height: 1.7;">
                    We aim to respond to all inquiries within 24 hours. Below is a copy of your message:
                  </p>

                  <!-- Copy of Message -->
                  <div style="background-color: #0d0d0f; border-left: 3px solid #ffffff; padding: 18px; border-radius: 0 12px 12px 0; font-size: 14px; line-height: 1.6; color: #d4d4d8; margin-bottom: 32px; white-space: pre-wrap;">${message}</div>

                  <p style="margin: 0 0 28px 0; font-size: 14px; color: #71717a; line-height: 1.6;">
                    If you have any additional details or urgent requests, feel free to reply directly to this email.
                  </p>

                  <!-- CTA Button -->
                  <table width="100%" border="0" cellspacing="0" cellpadding="0">
                    <tr>
                      <td align="center">
                        <a href="https://storm-calisthenics.vercel.app/products" style="display: inline-block; padding: 14px 32px; background-color: #ffffff; color: #0a0a0c; font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; text-decoration: none; border-radius: 8px;">
                          EXPLORE EQUIPMENT
                        </a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="padding: 24px 32px; background-color: #0d0d0f; border-top: 1px solid rgba(255, 255, 255, 0.06); text-align: center;">
                  <p style="margin: 0 0 8px 0; font-size: 13px; font-weight: 600; color: #ffffff;">STORM CALISTHENICS</p>
                  <p style="margin: 0; font-size: 12px; color: #52525b;">Premium Calisthenics & Gym Equipment</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
  `;
}

export async function sendContactEmails(params: SendEmailParams) {
  const transporter = createTransporter();

  let toEmail = process.env.CONTACT_RECEIVER_EMAIL?.trim();

  if (!toEmail || isPlaceholderEmail(toEmail)) {
    if (params.receiverEmail && !isPlaceholderEmail(params.receiverEmail)) {
      toEmail = params.receiverEmail.trim();
    } else {
      toEmail = (process.env.GMAIL_USER || process.env.SMTP_USER)?.trim();
    }
  }

  if (!transporter || !toEmail) {
    console.warn(
      "Gmail / SMTP credentials are missing or recipient email is not configured in .env.local. Logging contact submission:",
      params
    );
    return {
      success: true,
      simulated: true,
      message: "Message received (SMTP credentials pending configuration).",
    };
  }

  const currentDate = new Date().toLocaleString("en-US", {
    dateStyle: "full",
    timeStyle: "short",
  });

  const adminMailOptions = {
    from: `"STORM Contact Form" <${process.env.GMAIL_USER || process.env.SMTP_USER}>`,
    to: toEmail,
    replyTo: params.email,
    subject: `⚡ [STORM Contact] ${params.subject || "New inquiry from " + params.name}`,
    html: getAdminNotificationEmailHtml({
      name: params.name,
      email: params.email,
      phone: params.phone,
      subject: params.subject,
      message: params.message,
      date: currentDate,
    }),
  };

  const customerMailOptions = {
    from: `"STORM Calisthenics" <${process.env.GMAIL_USER || process.env.SMTP_USER}>`,
    to: params.email,
    subject: `We received your message - STORM Calisthenics`,
    html: getCustomerConfirmationEmailHtml({
      name: params.name,
      message: params.message,
    }),
  };

  // Send admin notification
  try {
    await transporter.sendMail(adminMailOptions);
  } catch (err: any) {
    console.error("Error sending admin notification email via Gmail SMTP:", err);
    throw new Error(
      err.message || "Failed to send email to administrator."
    );
  }

  // Send auto-responder to customer (attempt quietly, do not throw if customer email bounces)
  try {
    await transporter.sendMail(customerMailOptions);
  } catch (err) {
    console.error("Error sending customer auto-confirmation email:", err);
  }

  return { success: true, simulated: false };
}

/* ========================================================================== */
/*                           ORDER EMAIL TEMPLATES                            */
/* ========================================================================== */

export function getOrderNotificationAdminHtml(params: SendOrderEmailParams) {
  const currency = params.currency || "TND";
  const itemsHtml = params.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 12px 16px; border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 14px; font-weight: 600; color: #ffffff;">
          ${item.name}
        </td>
        <td align="center" style="padding: 12px 16px; border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 14px; color: #a1a1aa;">
          x${item.quantity}
        </td>
        <td align="right" style="padding: 12px 16px; border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 14px; font-weight: 600; color: #ffffff;">
          ${item.price} ${currency}
        </td>
        <td align="right" style="padding: 12px 16px; border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 14px; font-weight: 700; color: #007aff;">
          ${(item.price * item.quantity).toFixed(2)} ${currency}
        </td>
      </tr>`
    )
    .join("");

  return `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Confirmed - STORM Calisthenics</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #0a0a0c; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #e4e4e7;">
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0a0a0c; padding: 40px 10px;">
        <tr>
          <td align="center">
            <table width="100%" max-width="650" border="0" cellspacing="0" cellpadding="0" style="max-width: 650px; background-color: #141417; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);">
              
              <!-- Header -->
              <tr>
                <td style="padding: 32px; background: linear-gradient(180deg, #1c1c22 0%, #141417 100%); border-bottom: 1px solid rgba(255, 255, 255, 0.08); text-align: center;">
                  <h1 style="margin: 0; font-size: 28px; font-weight: 900; letter-spacing: -1px; color: #ffffff;">STORM</h1>
                  <div style="margin-top: 8px; display: inline-block; padding: 6px 16px; background-color: rgba(0, 122, 255, 0.15); border: 1px solid rgba(0, 122, 255, 0.3); border-radius: 20px;">
                    <span style="font-size: 12px; text-transform: uppercase; letter-spacing: 2px; color: #007aff; font-weight: 800;">⚡ NEW ORDER CONFIRMED</span>
                  </div>
                  <p style="margin: 12px 0 0 0; font-size: 16px; font-weight: 700; color: #ffffff;">Order #${params.orderNumber}</p>
                </td>
              </tr>

              <!-- Customer Info Card -->
              <tr>
                <td style="padding: 32px 32px 16px 32px;">
                  <h2 style="margin: 0 0 16px 0; font-size: 16px; text-transform: uppercase; letter-spacing: 1px; color: #71717a; font-weight: 700;">Customer Details</h2>
                  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0d0d0f; border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 12px;">
                    <tr>
                      <td style="padding: 20px;">
                        <table width="100%" border="0" cellspacing="0" cellpadding="6">
                          <tr>
                            <td width="120" style="font-size: 12px; font-weight: 700; text-transform: uppercase; color: #71717a;">Customer:</td>
                            <td style="font-size: 14px; font-weight: 700; color: #ffffff;">${params.customerName}</td>
                          </tr>
                          <tr>
                            <td style="font-size: 12px; font-weight: 700; text-transform: uppercase; color: #71717a;">Phone:</td>
                            <td style="font-size: 14px; font-weight: 700; color: #007aff;"><a href="tel:${params.phone}" style="color: #007aff; text-decoration: none;">${params.phone}</a></td>
                          </tr>
                          ${
                            params.email
                              ? `<tr>
                            <td style="font-size: 12px; font-weight: 700; text-transform: uppercase; color: #71717a;">Email:</td>
                            <td style="font-size: 14px; color: #ffffff;"><a href="mailto:${params.email}" style="color: #ffffff; text-decoration: none;">${params.email}</a></td>
                          </tr>`
                              : ""
                          }
                          <tr>
                            <td style="font-size: 12px; font-weight: 700; text-transform: uppercase; color: #71717a;">City:</td>
                            <td style="font-size: 14px; color: #ffffff;">${params.city}</td>
                          </tr>
                          <tr>
                            <td style="font-size: 12px; font-weight: 700; text-transform: uppercase; color: #71717a;">Address:</td>
                            <td style="font-size: 14px; color: #d4d4d8;">${params.address}</td>
                          </tr>
                          <tr>
                            <td style="font-size: 12px; font-weight: 700; text-transform: uppercase; color: #71717a;">Payment:</td>
                            <td style="font-size: 13px; font-weight: 700; color: #10b981; text-transform: uppercase;">${params.paymentMethod || "Cash on Delivery (COD)"}</td>
                          </tr>
                          ${
                            params.notes
                              ? `<tr>
                            <td style="font-size: 12px; font-weight: 700; text-transform: uppercase; color: #71717a;">Notes:</td>
                            <td style="font-size: 13px; color: #e4e4e7;">${params.notes}</td>
                          </tr>`
                              : ""
                          }
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Items Table -->
              <tr>
                <td style="padding: 16px 32px 32px 32px;">
                  <h2 style="margin: 0 0 16px 0; font-size: 16px; text-transform: uppercase; letter-spacing: 1px; color: #71717a; font-weight: 700;">Ordered Items</h2>
                  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0d0d0f; border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 12px; overflow: hidden; border-collapse: collapse;">
                    <thead>
                      <tr style="background-color: #1a1a1f; border-bottom: 1px solid rgba(255,255,255,0.08);">
                        <th align="left" style="padding: 12px 16px; font-size: 11px; text-transform: uppercase; color: #71717a; font-weight: 700;">Product</th>
                        <th align="center" style="padding: 12px 16px; font-size: 11px; text-transform: uppercase; color: #71717a; font-weight: 700;">Qty</th>
                        <th align="right" style="padding: 12px 16px; font-size: 11px; text-transform: uppercase; color: #71717a; font-weight: 700;">Unit Price</th>
                        <th align="right" style="padding: 12px 16px; font-size: 11px; text-transform: uppercase; color: #71717a; font-weight: 700;">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${itemsHtml}
                    </tbody>
                  </table>

                  <!-- Totals Summary -->
                  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top: 20px;">
                    <tr>
                      <td align="right">
                        <table border="0" cellspacing="0" cellpadding="4" style="min-width: 240px;">
                          <tr>
                            <td style="font-size: 13px; color: #71717a;">Subtotal:</td>
                            <td align="right" style="font-size: 14px; color: #ffffff;">${params.subtotal.toFixed(2)} ${currency}</td>
                          </tr>
                          <tr>
                            <td style="font-size: 13px; color: #71717a;">Delivery Fee:</td>
                            <td align="right" style="font-size: 14px; color: #ffffff;">${params.deliveryFee.toFixed(2)} ${currency}</td>
                          </tr>
                          <tr style="border-top: 1px solid rgba(255,255,255,0.1);">
                            <td style="font-size: 16px; font-weight: 800; color: #ffffff; padding-top: 8px;">Grand Total:</td>
                            <td align="right" style="font-size: 18px; font-weight: 900; color: #007aff; padding-top: 8px;">${params.total.toFixed(2)} ${currency}</td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="padding: 24px 32px; background-color: #0d0d0f; border-top: 1px solid rgba(255, 255, 255, 0.06); text-align: center;">
                  <p style="margin: 0; font-size: 12px; color: #52525b;">STORM Calisthenics Order Management System</p>
                  <p style="margin: 4px 0 0 0; font-size: 11px; color: #3f3f46;">Built for performance. Tested in the storm.</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
  `;
}

export function getOrderConfirmationCustomerHtml(params: SendOrderEmailParams) {
  const currency = params.currency || "TND";
  const itemsHtml = params.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 12px 16px; border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 14px; font-weight: 600; color: #ffffff;">
          ${item.name}
        </td>
        <td align="center" style="padding: 12px 16px; border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 14px; color: #a1a1aa;">
          x${item.quantity}
        </td>
        <td align="right" style="padding: 12px 16px; border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 14px; font-weight: 700; color: #ffffff;">
          ${(item.price * item.quantity).toFixed(2)} ${currency}
        </td>
      </tr>`
    )
    .join("");

  return `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Confirmation - STORM Calisthenics</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #0a0a0c; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #e4e4e7;">
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0a0a0c; padding: 40px 10px;">
        <tr>
          <td align="center">
            <table width="100%" max-width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #141417; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);">
              
              <!-- Header -->
              <tr>
                <td style="padding: 36px 32px; background: linear-gradient(180deg, #1c1c22 0%, #141417 100%); border-bottom: 1px solid rgba(255, 255, 255, 0.08); text-align: center;">
                  <h1 style="margin: 0; font-size: 32px; font-weight: 900; letter-spacing: -1.5px; color: #ffffff;">STORM</h1>
                  <p style="margin: 8px 0 0 0; font-size: 12px; text-transform: uppercase; letter-spacing: 4px; color: #007aff; font-weight: 700;">BECOME THE STORM</p>
                </td>
              </tr>

              <!-- Content -->
              <tr>
                <td style="padding: 36px 32px;">
                  <h2 style="margin: 0 0 12px 0; font-size: 22px; font-weight: 800; color: #ffffff;">Order Confirmed! ⚡</h2>
                  <p style="margin: 0 0 20px 0; font-size: 15px; color: #a1a1aa; line-height: 1.7;">
                    Thank you, <strong style="color: #ffffff;">${params.customerName}</strong>! We have received your order <strong style="color: #007aff;">#${params.orderNumber}</strong>. Our team is packing your gear for delivery.
                  </p>

                  <!-- Order Summary Table -->
                  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0d0d0f; border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 12px; overflow: hidden; margin-bottom: 24px;">
                    <thead>
                      <tr style="background-color: #1a1a1f; border-bottom: 1px solid rgba(255,255,255,0.08);">
                        <th align="left" style="padding: 12px 16px; font-size: 11px; text-transform: uppercase; color: #71717a;">Product</th>
                        <th align="center" style="padding: 12px 16px; font-size: 11px; text-transform: uppercase; color: #71717a;">Qty</th>
                        <th align="right" style="padding: 12px 16px; font-size: 11px; text-transform: uppercase; color: #71717a;">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${itemsHtml}
                    </tbody>
                  </table>

                  <!-- Shipping & Total Summary -->
                  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0d0d0f; border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 12px; padding: 20px; margin-bottom: 28px;">
                    <tr>
                      <td>
                        <p style="margin: 0 0 6px 0; font-size: 12px; text-transform: uppercase; color: #71717a; font-weight: 700;">Delivery Address:</p>
                        <p style="margin: 0 0 16px 0; font-size: 14px; color: #ffffff;">${params.address}, ${params.city} (${params.phone})</p>
                        
                        <p style="margin: 0 0 4px 0; font-size: 12px; text-transform: uppercase; color: #71717a; font-weight: 700;">Total Amount Due (COD):</p>
                        <p style="margin: 0; font-size: 20px; font-weight: 900; color: #007aff;">${params.total.toFixed(2)} ${currency}</p>
                      </td>
                    </tr>
                  </table>

                  <p style="margin: 0 0 28px 0; font-size: 14px; color: #71717a; line-height: 1.6;">
                    If you have any questions regarding your order, reply directly to this email or call our support line.
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="padding: 24px 32px; background-color: #0d0d0f; border-top: 1px solid rgba(255, 255, 255, 0.06); text-align: center;">
                  <p style="margin: 0 0 4px 0; font-size: 13px; font-weight: 700; color: #ffffff;">STORM CALISTHENICS</p>
                  <p style="margin: 0; font-size: 12px; color: #52525b;">Forge your discipline.</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
  `;
}

export async function sendOrderConfirmationEmails(params: SendOrderEmailParams) {
  const transporter = createTransporter();

  let adminReceiver = process.env.CONTACT_RECEIVER_EMAIL?.trim();
  if (!adminReceiver || isPlaceholderEmail(adminReceiver)) {
    adminReceiver = (process.env.GMAIL_USER || process.env.SMTP_USER)?.trim();
  }

  if (!transporter || !adminReceiver) {
    console.warn(
      "Gmail / SMTP credentials are missing or recipient email is not configured in .env.local. Skipping order email dispatch for:",
      params.orderNumber
    );
    return { success: true, simulated: true };
  }

  // 1. Send Admin Notification Email
  const adminMailOptions = {
    from: `"STORM Orders" <${process.env.GMAIL_USER || process.env.SMTP_USER}>`,
    to: adminReceiver,
    subject: `⚡ Order Confirmed! [#${params.orderNumber}] - ${params.customerName}`,
    html: getOrderNotificationAdminHtml(params),
  };

  try {
    await transporter.sendMail(adminMailOptions);
  } catch (err: any) {
    console.error("Error sending admin order notification email:", err);
  }

  // 2. Send Customer Confirmation Email (if valid email provided)
  if (params.email && !isPlaceholderEmail(params.email)) {
    const customerMailOptions = {
      from: `"STORM Calisthenics" <${process.env.GMAIL_USER || process.env.SMTP_USER}>`,
      to: params.email.trim(),
      subject: `Order Confirmed! - STORM Calisthenics [#${params.orderNumber}]`,
      html: getOrderConfirmationCustomerHtml(params),
    };

    try {
      await transporter.sendMail(customerMailOptions);
    } catch (err) {
      console.error("Error sending customer order confirmation email:", err);
    }
  }

  return { success: true, simulated: false };
}
