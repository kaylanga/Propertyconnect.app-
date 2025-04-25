import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  template: string;
  context: Record<string, any>;
}

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  private async renderTemplate(template: string, context: Record<string, any>): Promise<string> {
    // Implement template rendering logic here
    // You could use a template engine like handlebars or ejs
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .button { display: inline-block; padding: 10px 20px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 5px; }
          </style>
        </head>
        <body>
          <div class="container">
            ${template}
          </div>
        </body>
      </html>
    `;
  }

  async sendBookingConfirmation(options: {
    to: string;
    name: string;
    propertyTitle: string;
    date: string;
    time: string;
  }) {
    const template = `
      <h2>Booking Confirmation</h2>
      <p>Dear ${options.name},</p>
      <p>Your viewing appointment for ${options.propertyTitle} has been confirmed for ${options.date} at ${options.time}.</p>
      <p>If you need to reschedule or cancel your appointment, please contact us.</p>
      <p>Thank you for choosing our service!</p>
    `;

    await this.sendEmail({
      to: options.to,
      subject: 'Viewing Appointment Confirmation',
      template,
      context: options
    });
  }

  async sendPropertyAlert(options: {
    to: string;
    name: string;
    properties: Array<{
      title: string;
      price: number;
      location: string;
      url: string;
    }>;
  }) {
    const propertiesList = options.properties
      .map(property => `
        <div style="margin-bottom: 20px;">
          <h3>${property.title}</h3>
          <p>Price: UGX ${property.price.toLocaleString()}</p>
          <p>Location: ${property.location}</p>
          <a href="${property.url}" class="button">View Property</a>
        </div>
      `)
      .join('');

    const template = `
      <h2>New Properties Matching Your Criteria</h2>
      <p>Dear ${options.name},</p>
      <p>We found some properties that match your search criteria:</p>
      ${propertiesList}
      <p>Visit our website to see more properties!</p>
    `;

    await this.sendEmail({
      to: options.to,
      subject: 'New Property Alerts',
      template,
      context: options
    });
  }

  async sendPasswordReset(options: {
    to: string;
    name: string;
    resetLink: string;
  }) {
    const template = `
      <h2>Password Reset Request</h2>
      <p>Dear ${options.name},</p>
      <p>We received a request to reset your password. Click the button below to reset it:</p>
      <p><a href="${options.resetLink}" class="button">Reset Password</a></p>
      <p>If you didn't request this, please ignore this email.</p>
      <p>This link will expire in 1 hour.</p>
    `;

    await this.sendEmail({
      to: options.to,
      subject: 'Password Reset Request',
      template,
      context: options
    });
  }

  private async sendEmail(options: EmailOptions) {
    const html = await this.renderTemplate(options.template, options.context);

    await this.transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: options.to,
      subject: options.subject,
      html
    });
  }
}

export const emailService = new EmailService(); 