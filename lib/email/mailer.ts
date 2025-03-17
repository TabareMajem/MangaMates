import sgMail from '@sendgrid/mail';
import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

class Mailer {
  private transporter: nodemailer.Transporter;

  constructor() {
    if (process.env.SENDGRID_API_KEY) {
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    }

    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendMail(options: EmailOptions): Promise<void> {
    if (process.env.SENDGRID_API_KEY) {
      await this.sendWithSendGrid(options);
    } else {
      await this.sendWithSMTP(options);
    }
  }

  private async sendWithSendGrid(options: EmailOptions): Promise<void> {
    await sgMail.send({
      to: options.to,
      from: process.env.EMAIL_FROM || 'noreply@example.com',
      subject: options.subject,
      text: options.text,
      html: options.html,
    });
  }

  private async sendWithSMTP(options: EmailOptions): Promise<void> {
    await this.transporter.sendMail({
      from: process.env.EMAIL_FROM || 'noreply@example.com',
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    });
  }
}

export const mailer = new Mailer();

export const sendEmail = async (options: EmailOptions): Promise<void> => {
  const mailerInstance = new Mailer();
  await mailerInstance.sendMail(options);
};

export { type EmailOptions };
