const Redis = require('redis');
const logger = require('../utils/logger');

class CacheService {
  constructor() {
    this.client = null;
    this.connect();
  }

  async connect() {
    try {
      this.client = Redis.createClient({
        url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
        password: process.env.REDIS_PASSWORD
      });

      this.client.on('error', (err) => {
        logger.error('Redis Client Error:', err);
      });

      await this.client.connect();
      logger.info('Connected to Redis');
    } catch (error) {
      logger.error('Failed to connect to Redis:', error);
      throw error;
    }
  }

  async get(key) {
    try {
      const value = await this.client.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      logger.error(`Error getting key ${key} from Redis:`, error);
      return null;
    }
  }

  async set(key, value, ttl = 3600) { // Default TTL: 1 hour
    try {
      await this.client.set(key, JSON.stringify(value), { EX: ttl });
    } catch (error) {
      logger.error(`Error setting key ${key} in Redis:`, error);
    }
  }

  async del(key) {
    try {
      await this.client.del(key);
    } catch (error) {
      logger.error(`Error deleting key ${key} from Redis:`, error);
    }
  }

  generateKey(...parts) {
    return `partkasa:search:${parts.join(':')}`;
  }
}

module.exports = new CacheService();
