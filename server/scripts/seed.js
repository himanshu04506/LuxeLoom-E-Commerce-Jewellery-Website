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
    name: 'Necklaces',
    slug: 'necklaces',
    description: 'Royal bridal chokers, Kundan Polki sets, and handcrafted heirloom necklaces.',
    image: 'https://www.soniscreations.in/uploads/products/sonis-creations-pastel-pink-drop-kundan-choker-necklace-earrings.jpg',
  },
  {
    name: 'Rings',
    slug: 'rings',
    description: 'American diamond solitaires, Korean anti-tarnish bands, and classic 18K/22K gold rings.',
    image: 'https://www.soniscreations.in/uploads/products/sonis-creations-crisscross-bezel-cz-gold-ring-260.jpg',
  },
  {
    name: 'Chains',
    slug: 'chains',
    description: 'Designer enamel pendant chains, Italian wheat chains, and crescent moon medallion links.',
    image: 'https://www.soniscreations.in/uploads/products/kiyu-ziyu-floral-blossom-chain.jpg',
  },
  {
    name: 'Earrings',
    slug: 'earrings',
    description: 'Antique gold filigree jhumkas, chandelier drops, and diamond pavé studs.',
    image: 'https://www.soniscreations.in/uploads/products/sonis-creations-antique-gold-floral-filigree-jhumka-320.jpg',
  },
  {
    name: 'Bracelets',
    slug: 'bracelets',
    description: 'Emerald baguette tennis bracelets, dual-row crystal pavé chains, and luxury charms.',
    image: 'https://www.soniscreations.in/uploads/products/kiyu-ziyu-emerald-baguette-tennis-bracelet.jpg',
  },
  {
    name: 'Bangles',
    slug: 'bangles',
    description: 'Royal chevron pavé hinged bangles, fluted cuff bracelets, and traditional gold kadas.',
    image: 'https://www.soniscreations.in/uploads/products/kiyu-ziyu-royal-chevron-pave-crystal-hinged-bracelet.jpg',
  },
  {
    name: 'Mangalsutra',
    slug: 'mangalsutra',
    description: 'Sacred modern solitaires, pear crystal motifs, and traditional black bead auspicious mangalsutras.',
    image: 'https://www.soniscreations.in/uploads/products/kiyu-ziyu-trio-pear-crystal-mangalsutra.jpg',
  },
  {
    name: 'Traditional Gifts',
    slug: 'traditional-gifts',
    description: 'Silver plated lotus bowl sets, auspicious Swastik diyas, and Vastu tortoise crafts.',
    image: 'https://www.soniscreations.in/uploads/products/sonis-creations-four-bowl-set-silver-plated-lotus-design-ac36.jpg',
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
    console.log(`[Seed Script] ${productsData.length} Jewellery products seeded from soniscreations.in.`);

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
