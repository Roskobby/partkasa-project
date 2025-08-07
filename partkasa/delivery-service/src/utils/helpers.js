/**
 * Generate a unique tracking number for deliveries
 * Format: PKD-YYYYMMDD-XXXXXX
 * where:
 * - PKD is the prefix for PartKasa Delivery
 * - YYYYMMDD is the current date
 * - XXXXXX is a random 6-digit number
 */
exports.generateTrackingNumber = () => {
  const prefix = 'PKD';
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
  return `${prefix}-${date}-${random}`;
};
