const logger = require('./logger');
const cacheService = require('../services/cache.service');
const { Vehicle } = require('../models');
const nhtsaService = require('../services/nhtsa.service');

/**
 * Cleanup utility for maintaining vehicle data and cache
 */
class CleanupUtil {
  /**
   * Refresh all vehicle makes in the database
   */
  static async refreshVehicleMakes() {
    try {
      logger.info('Starting vehicle makes refresh...');
      const makes = await nhtsaService.getMakes();
      
      // Update cache
      await cacheService.set(
        cacheService.generateKey('makes'),
        makes,
        86400
      );

      // Update database
      let updated = 0;
      for (const make of makes) {
        await Vehicle.findOneAndUpdate(
          { make },
          { make },
          { upsert: true }
        );
        updated++;
      }

      logger.info(`Successfully refreshed ${updated} vehicle makes`);
    } catch (error) {
      logger.error('Error refreshing vehicle makes:', error);
    }
  }

  /**
   * Clean up old cache entries
   */
  static async cleanupCache() {
    try {
      logger.info('Starting cache cleanup...');
      const keys = await cacheService.client.keys('partkasa:search:*');
      
      for (const key of keys) {
        const ttl = await cacheService.client.ttl(key);
        if (ttl <= 0) {
          await cacheService.del(key);
          logger.info(`Deleted expired cache key: ${key}`);
        }
      }
      
      logger.info('Cache cleanup completed');
    } catch (error) {
      logger.error('Error cleaning up cache:', error);
    }
  }

  /**
   * Schedule regular cleanup tasks
   */
  static scheduleCleanup() {
    // Refresh vehicle makes daily
    setInterval(this.refreshVehicleMakes, 24 * 60 * 60 * 1000);
    
    // Clean up cache hourly
    setInterval(this.cleanupCache, 60 * 60 * 1000);
    
    logger.info('Cleanup tasks scheduled');
  }
}

module.exports = CleanupUtil;
