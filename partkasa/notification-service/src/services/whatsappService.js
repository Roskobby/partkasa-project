const twilio = require('twilio');

class WhatsAppService {
  constructor() {
    this.client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
    this.fromNumber = process.env.TWILIO_WHATSAPP_NUMBER;
  }

  async sendMessage(to, message) {
    try {
      const response = await this.client.messages.create({
        from: this.fromNumber,
        to: `whatsapp:${to}`,
        body: message
      });
      
      return {
        success: true,
        messageId: response.sid
      };
    } catch (error) {
      console.error('WhatsApp notification error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = new WhatsAppService();
