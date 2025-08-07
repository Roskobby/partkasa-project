const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the Vehicle schema
const VehicleSchema = new Schema({
  make: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  model: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  year: {
    type: Number,
    required: true,
    index: true
  },
  trim: {
    type: String,
    trim: true
  },
  engine: {
    type: String,
    trim: true
  },
  transmission: {
    type: String,
    enum: ['automatic', 'manual', 'cvt', 'dual-clutch', 'other'],
    index: true
  },
  fuelType: {
    type: String,
    enum: ['gasoline', 'diesel', 'electric', 'hybrid', 'plug-in hybrid', 'other'],
    index: true
  },
  bodyStyle: {
    type: String,
    enum: ['sedan', 'suv', 'truck', 'hatchback', 'coupe', 'convertible', 'wagon', 'van', 'minivan', 'other'],
    index: true
  },
  drivetrain: {
    type: String,
    enum: ['fwd', 'rwd', 'awd', '4wd', 'other'],
    index: true
  },
  specifications: {
    type: Map,
    of: String
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

// Create compound index for efficient lookups
VehicleSchema.index({ make: 1, model: 1, year: 1 }, { unique: true });

// Create text index for search
VehicleSchema.index({
  make: 'text',
  model: 'text',
  trim: 'text',
  engine: 'text'
}, {
  weights: {
    make: 10,
    model: 5,
    trim: 3,
    engine: 2
  },
  name: 'vehicle_text_index'
});

// Pre-save middleware to update the updatedAt field
VehicleSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Static method to find compatible vehicles
VehicleSchema.statics.findCompatible = async function(make, model, year) {
  return this.find({
    make: make,
    model: model,
    year: year
  });
};

// Static method to get all makes
VehicleSchema.statics.getAllMakes = async function() {
  return this.distinct('make').sort();
};

// Static method to get models by make
VehicleSchema.statics.getModelsByMake = async function(make) {
  return this.distinct('model', { make: make }).sort();
};

// Static method to get years by make and model
VehicleSchema.statics.getYearsByMakeAndModel = async function(make, model) {
  const vehicles = await this.find({ make: make, model: model }, 'year').sort({ year: -1 });
  return vehicles.map(v => v.year);
};

// Create the model
const Vehicle = mongoose.model('Vehicle', VehicleSchema);

module.exports = Vehicle;
