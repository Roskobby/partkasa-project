const axios = require('axios');
const logger = require('../utils/logger');

class PaystackService {
  constructor() {
    this.secretKey = process.env.PAYSTACK_SECRET_KEY;
    this.baseUrl = 'https://api.paystack.co';
    this.isTestMode = process.env.NODE_ENV !== 'production';
  }

  /**
   * Initialize a payment transaction
   */
  async initializeTransaction(data) {
    try {
      if (this.isTestMode) {
        // Mock successful response in test mode
        return {
          status: true,
          data: {
            authorization_url: `https://checkout.paystack.com/${Math.random().toString(36).substring(7)}`,
            access_code: Math.random().toString(36).substring(7),
            reference: `REF-${Date.now()}-${Math.random().toString(36).substring(7)}`
          }
        };
      }

      const response = await axios.post(
        `${this.baseUrl}/transaction/initialize`,
        {
          amount: Math.round(data.amount * 100), // Convert to pesewas
          email: data.email,
          currency: 'GHS',
          callback_url: data.callbackUrl,
          reference: data.reference,
          metadata: data.metadata
        },
        {
          headers: {
            'Authorization': `Bearer ${this.secretKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data;
    } catch (error) {
      logger.error('Paystack initialize transaction error:', error);
      throw error;
    }
  }

  /**
   * Verify a payment transaction
   */
  async verifyTransaction(reference) {
    try {
      if (this.isTestMode) {
        // Mock successful verification in test mode
        return {
          status: true,
          data: {
            status: 'success',
            reference,
            amount: 100000, // Amount in pesewas
            gateway_response: 'Successful',
            paid_at: new Date().toISOString(),
            channel: 'mobile_money',
            currency: 'GHS',
            metadata: {}
          }
        };
      }

      const response = await axios.get(
        `${this.baseUrl}/transaction/verify/${reference}`,
        {
          headers: {
            'Authorization': `Bearer ${this.secretKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data;
    } catch (error) {
      logger.error('Paystack verify transaction error:', error);
      throw error;
    }
  }
}

module.exports = new PaystackService();
