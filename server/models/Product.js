const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['Rings', 'Necklaces', 'Earrings', 'Bracelets', 'Bangles', 'Chains', 'Pendants'],
    },
    subcategory: {
      type: String,
      default: 'General',
    },
    metalType: {
      type: String,
      required: true,
      enum: ['GOLD', 'SILVER'],
      uppercase: true,
    },
    purity: {
      type: String,
      required: true,
      enum: ['24K', '22K', '18K', '925'],
    },
    weight: {
      type: Number,
      required: [true, 'Weight in grams is required'],
      min: 0.1,
    },
    makingCharges: {
      type: Number,
      default: 500,
      min: 0,
    },
    wastagePercentage: {
      type: Number,
      default: 3.0,
      min: 0,
    },
    stoneCharges: {
      type: Number,
      default: 0,
      min: 0,
    },
    gstPercentage: {
      type: Number,
      default: 3.0,
    },
    images: [
      {
        type: String,
        required: true,
      },
    ],
    stock: {
      type: Number,
      required: true,
      default: 10,
      min: 0,
    },
    sku: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isBestSeller: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

productSchema.index({ category: 1, metalType: 1, purity: 1 });
productSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Product', productSchema);
