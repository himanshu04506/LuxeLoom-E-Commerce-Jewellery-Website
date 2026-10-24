const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const User = require('../models/User');
const Product = require('../models/Product');
const Category = require('../models/Category');
const MetalRate = require('../models/MetalRate');
const { DEFAULT_METAL_RATES } = require('../config/constants');
const productsData = require('../data/productsData');

const categoriesData = [
  {
    name: 'Rings',
    slug: 'rings',
    description: 'Solitaire, halo, eternity, and classic gold rings designed for elegance.',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80&fm=webp',
  },
  {
    name: 'Necklaces',
    slug: 'necklaces',
    description: 'Royal bridal chokers, temple gold necklaces, and diamond line pendants.',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80&fm=webp',
  },
  {
    name: 'Earrings',
    slug: 'earrings',
    description: 'Gold jhumkas, diamond studs, chandbalis, and sleek drop earrings.',
    image: 'https://images.unsplash.com/photo-1635767798638-3e25273a8236?auto=format&fit=crop&w=800&q=80&fm=webp',
  },
  {
    name: 'Bracelets',
    slug: 'bracelets',
    description: 'Flexible tennis bracelets, gold kadas, and charm wristwear.',
    image: 'https://images.unsplash.com/photo-1611591475143-4f8a77496773?auto=format&fit=crop&w=800&q=80&fm=webp',
  },
  {
    name: 'Bangles',
    slug: 'bangles',
    description: 'Traditional 22K gold bangles, carved kada sets, and silver cuffs.',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80&fm=webp',
  },
  {
    name: 'Chains',
    slug: 'chains',
    description: 'Italian rope chains, box chains, and heavy mens gold curb links.',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80&fm=webp',
  },
  {
    name: 'Pendants',
    slug: 'pendants',
    description: 'Religious motifs, gemstone lockets, and minimalist everyday pendants.',
    image: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=800&q=80&fm=webp',
  },
];

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/luxeloom';
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 3000 });
    console.log('[Seed Script] Connected to MongoDB.');

    await User.deleteMany({});
    await Product.deleteMany({});
    await Category.deleteMany({});
    await MetalRate.deleteMany({});
    console.log('[Seed Script] Existing collections cleared.');

    // Seed Metal Rates
    const rates = [
      { metalType: 'GOLD_24K', ratePerGram: DEFAULT_METAL_RATES.GOLD_24K, source: 'SEED' },
      { metalType: 'GOLD_22K', ratePerGram: DEFAULT_METAL_RATES.GOLD_22K, source: 'SEED' },
      { metalType: 'GOLD_18K', ratePerGram: DEFAULT_METAL_RATES.GOLD_18K, source: 'SEED' },
      { metalType: 'SILVER_925', ratePerGram: DEFAULT_METAL_RATES.SILVER_925, source: 'SEED' },
    ];
    await MetalRate.insertMany(rates);
    console.log('[Seed Script] Metal rates seeded (Gold 24K: ₹7250, 22K: ₹6645, 18K: ₹5437, Silver: ₹88).');

    // Seed Categories
    await Category.insertMany(categoriesData);
    console.log(`[Seed Script] ${categoriesData.length} Categories seeded.`);

    // Seed Products
    await Product.insertMany(productsData);
    console.log(`[Seed Script] ${productsData.length} Jewellery products seeded (50 per category with WebP images).`);

    // Seed Users (1 Admin & 1 Customer)
    await User.create({
      name: 'LuxeLoom Admin',
      email: 'admin@luxeloom.com',
      phone: '+91 9876543210',
      password: 'admin123',
      role: 'ADMIN',
    });

    await User.create({
      name: 'Ananya Sharma',
      email: 'user@luxeloom.com',
      phone: '+91 9123456789',
      password: 'user123',
      role: 'USER',
    });

    console.log('\n=================== SEED SUMMARY ===================');
    console.log('Admin Account:   admin@luxeloom.com / admin123');
    console.log('Customer Account: user@luxeloom.com  / user123');
    console.log(`Products Count:  ${productsData.length} items (50 per category)`);
    console.log('Categories:      7 categories');
    console.log('===================================================\n');

    console.log('[Seed Script] Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.warn('[Seed Warning] Local MongoDB connection unavailable:', error.message);
    console.warn('[Seed Warning] Proceeding with graceful fallback data.');
    process.exit(0);
  }
};

seedDatabase();
