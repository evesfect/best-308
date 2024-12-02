import nodemailer from 'nodemailer';

// Email configuration
const emailConfig = {
  service: 'Gmail',
  auth: {
    user: 'ecommercebest308@gmail.com',
    pass: 'heac mosf eurq nppd',
  },
};

// Create transporter
const transporter = nodemailer.createTransport(emailConfig);

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  attachments?: {
    filename: string;
    content: Buffer;
    contentType?: string;
  }[];
}

/**
 * Sends an email using the configured transporter
 * @param options EmailOptions containing to, subject and html content
 * @returns Promise<boolean> indicating whether the email was sent successfully
 */
export const sendEmail = async (options: EmailOptions): Promise<boolean> => {
  try {
    await transporter.sendMail({
      from: emailConfig.auth.user,
      ...options,
    });
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

// Predefined email templates
export const emailTemplates = {
  passwordReset: (resetUrl: string) => ({
    subject: 'Password Reset Request',
    html: `
      <p>Hello,</p>
      <p>You requested to reset your password. Please click the link below to reset it:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>If you did not request this, please ignore this email.</p>
    `,
  }),

  orderConfirmation: (orderDetails: any) => ({
    subject: 'Order Confirmation',
    html: `
      <h1>Thank you for your order!</h1>
      <p>Order ID: ${orderDetails.orderId}</p>
      <p>Total Amount: $${orderDetails.total}</p>
      <p>We will notify you once your order has been shipped.</p>
    `,
  }),

  invoice: (invoiceDetails: any) => ({
    subject: 'Invoice for your order',
    html: `
      <h1>Invoice</h1>
      <p>Invoice Number: ${invoiceDetails.invoiceNumber}</p>
      <p>Order Date: ${invoiceDetails.orderDate}</p>
      <p>Total Amount: $${invoiceDetails.total}</p>
      <div style="margin-top: 20px;">
        ${invoiceDetails.items.map((item: any) => `
          <div>
            <p>Item: ${item.name}</p>
            <p>Quantity: ${item.quantity}</p>
            <p>Price: $${item.price}</p>
          </div>
        `).join('')}
      </div>
    `,
  }),
};