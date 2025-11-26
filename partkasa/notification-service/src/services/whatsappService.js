class WhatsAppService {
  constructor() {
    // Check if Twilio credentials are available and valid
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    
    if (accountSid && authToken && accountSid.startsWith('AC') && accountSid.length === 34) {
      const twilio = require('twilio');
      this.client = twilio(accountSid, authToken);
      this.fromNumber = process.env.TWILIO_PHONE_NUMBER;
      this.enabled = true;
    } else {
      console.warn('Twilio credentials not configured or invalid. WhatsApp service will run in mock mode.');
      this.client = null;
      this.fromNumber = null;
      this.enabled = false;
    }
  }

  async sendMessage(to, message) {
    try {
      if (!this.enabled) {
        console.log(`[MOCK] WhatsApp message to ${to}: ${message}`);
        return {
          success: true,
          messageId: 'mock-message-id',
          mock: true
        };
      }

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
