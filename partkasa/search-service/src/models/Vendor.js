const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the Vendor schema
const VendorSchema = new Schema({
  userId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  logo: {
    type: String
  },
  contactEmail: {
    type: String,
    required: true
  },
  contactPhone: {
    type: String,
    required: true
  },
  website: {
    type: String
  },
  address: {
    street: String,
    city: String,
    state: String,
    postalCode: String,
    country: String,
    coordinates: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        index: '2dsphere'
      }
    }
  },
  businessHours: {
    monday: { open: String, close: String },
    tuesday: { open: String, close: String },
    wednesday: { open: String, close: String },
    thursday: { open: String, close: String },
    friday: { open: String, close: String },
    saturday: { open: String, close: String },
    sunday: { open: String, close: String }
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationDocuments: [{
    type: String
  }],
  paymentMethods: [{
    type: String,
    enum: ['credit_card', 'debit_card', 'mobile_money', 'bank_transfer', 'cash_on_delivery']
  }],
  shippingMethods: [{
    name: String,
    description: String,
    estimatedDeliveryTime: String,
    cost: Number
  }],
  returnPolicy: {
    type: String
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended', 'pending'],
    default: 'pending'
  },
  tags: [{
    type: String
  }],
  specialties: [{
    type: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Create text index for search
VendorSchema.index({
  name: 'text',
  description: 'text',
  'address.city': 'text',
  'address.country': 'text',
  tags: 'text',
  specialties: 'text'
}, {
  weights: {
    name: 10,
    specialties: 5,
    tags: 3,
    description: 2,
    'address.city': 1,
    'address.country': 1
  },
  name: 'vendor_text_index'
});

// Pre-save middleware to update the updatedAt field
VendorSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Create the model
const Vendor = mongoose.model('Vendor', VendorSchema);

module.exports = Vendor;
