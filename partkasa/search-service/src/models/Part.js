const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the Part schema
const PartSchema = new Schema({
  partNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    index: true
  },
  subcategory: {
    type: String,
    index: true
  },
  price: {
    type: Number,
    required: true
  },
  discountPrice: {
    type: Number
  },
  images: [{
    type: String,
    required: true
  }],
  brand: {
    type: String,
    required: true,
    index: true
  },
  vendor: {
    type: Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true
  },
  stock: {
    type: Number,
    required: true,
    default: 0
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  compatibleVehicles: [{
    make: {
      type: String,
      required: true,
      index: true
    },
    model: {
      type: String,
      required: true,
      index: true
    },
    year: {
      type: Number,
      required: true,
      index: true
    },
    trim: {
      type: String
    },
    engine: {
      type: String
    }
  }],
  specifications: {
    type: Map,
    of: String
  },
  weight: {
    type: Number
  },
  dimensions: {
    length: Number,
    width: Number,
    height: Number,
    unit: {
      type: String,
      enum: ['cm', 'in'],
      default: 'cm'
    }
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
  tags: [{
    type: String,
    index: true
  }],
  location: {
    country: String,
    city: String,
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
  deliveryEstimate: {
    min: Number, // in days
    max: Number  // in days
  },
  warranty: {
    type: String
  },
  returnPolicy: {
    type: String
  },
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
PartSchema.index({
  name: 'text',
  description: 'text',
  partNumber: 'text',
  brand: 'text',
  'compatibleVehicles.make': 'text',
  'compatibleVehicles.model': 'text',
  tags: 'text'
}, {
  weights: {
    partNumber: 10,
    name: 5,
    brand: 3,
    'compatibleVehicles.make': 2,
    'compatibleVehicles.model': 2,
    tags: 2,
    description: 1
  },
  name: 'part_text_index'
});

// Create compound index for vehicle compatibility search
PartSchema.index({
  'compatibleVehicles.make': 1,
  'compatibleVehicles.model': 1,
  'compatibleVehicles.year': 1
});

// Pre-save middleware to update the updatedAt field
PartSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Create the model
const Part = mongoose.model('Part', PartSchema);

module.exports = Part;
