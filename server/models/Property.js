const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Property title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Property description is required']
  },
  price: {
    type: Number,
    required: [true, 'Property price is required'],
    min: [0, 'Price cannot be negative']
  },
  location: {
    type: String,
    required: [true, 'Property location is required']
  },
  bedrooms: {
    type: Number,
    required: [true, 'Number of bedrooms is required'],
    min: [0, 'Bedrooms cannot be negative']
  },
  bathrooms: {
    type: Number,
    required: [true, 'Number of bathrooms is required'],
    min: [0, 'Bathrooms cannot be negative']
  },
  area: {
    type: String,
    required: [true, 'Property area is required']
  },
  image: {
    type: String,
    required: [true, 'Property image is required']
  },
  type: {
    type: String,
    enum: ['apartment', 'house', 'villa', 'condo'],
    required: [true, 'Property type is required']
  },
  status: {
    type: String,
    enum: ['available', 'rented', 'sold'],
    default: 'available'
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Property', propertySchema);