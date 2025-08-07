const TelegramBot = require('node-telegram-bot-api');

class TelegramService {
  constructor() {
    this.bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: false });
  }

  async sendMessage(chatId, message) {
    try {
      const response = await this.bot.sendMessage(chatId, message);
      
      return {
        success: true,
        messageId: response.message_id
      };
    } catch (error) {
      console.error('Telegram notification error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = new TelegramService();
