const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    // Check if SMTP credentials are available
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });
      this.enabled = true;
    } else {
      console.warn('SMTP credentials not configured. Email service will run in mock mode.');
      this.transporter = null;
      this.enabled = false;
    }
  }

  async sendEmail(to, subject, text, html) {
    try {
      if (!this.enabled) {
        console.log(`[MOCK] Email to ${to}: ${subject}`);
        console.log(`[MOCK] Content: ${text || html}`);
        return {
          success: true,
          messageId: 'mock-email-id',
          mock: true
        };
      }

      const response = await this.transporter.sendMail({
        from: process.env.SMTP_FROM,
        to,
        subject,
        text,
        html
      });
      
      return {
        success: true,
        messageId: response.messageId
      };
    } catch (error) {
      console.error('Email notification error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = new EmailService();
