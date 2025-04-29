import nodemailer, { Transporter } from 'nodemailer';
import { Attachment } from 'nodemailer/lib/mailer';

class EmailService {
  private transporter: Transporter;
  private fromAddress: string;

  constructor() {
    this.fromAddress = process.env.EMAIL_FROM || 'yashs3324@gmail.com';

    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER_HOST || 'smtp.gmail.com',
      port: Number(process.env.EMAIL_SERVER_PORT) || 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_SERVER_USER || 'yashs3324@gmail.com',
        pass: process.env.EMAIL_SERVER_PASSWORD || 'avhszmzkkkfqjtwa',
      },
    });
  }

  /**
   * Send email using the configured transporter
   */
  async sendEmail(
    to: string,
    subject: string,
    html: string,
    attachments: Attachment[] = []
  ): Promise<boolean> {
    try {
      const info = await this.transporter.sendMail({
        from: `"Edviron Payment System" <${this.fromAddress}>`,
        to,
        subject,
        html,
        attachments,
      });

      console.log(`Email sent: ${info.messageId}`);
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  }

  /**
   * Verify the SMTP configuration
   */
  async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      console.log('SMTP connection verified successfully');
      return true;
    } catch (error) {
      console.error('SMTP connection verification failed:', error);
      return false;
    }
  }
}

// Create a singleton instance
const emailService = new EmailService();

export default emailService; 