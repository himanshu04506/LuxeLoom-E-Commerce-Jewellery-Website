// LuxeLoom Luxury Jewellery Dataset (350 items: 50 per category, interleaved order, 100% unique image URLs)

const categories = ['Rings', 'Necklaces', 'Earrings', 'Bracelets', 'Bangles', 'Chains', 'Pendants'];

const webpImages = {
  Rings: [
    'https://images.unsplash.com/photo-1605100804763-247f67b3557e',
    'https://images.unsplash.com/photo-1603561591411-07134e71a2a9'
  ],
  Necklaces: [
    'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f',
    'https://images.unsplash.com/photo-1600003014608-a2cb70503f19'
  ],
  Earrings: [
    'https://images.unsplash.com/photo-1635767798638-3e25273a8236',
    'https://images.unsplash.com/photo-1630019852942-f89202989a59'
  ],
  Bracelets: [
    'https://images.unsplash.com/photo-1611591475143-4f8a77496773',
    'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1'
  ],
  Bangles: [
    'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908'
  ],
  Chains: [
    'https://images.unsplash.com/photo-1599643477877-530eb83abc8e'
  ],
  Pendants: [
    'https://images.unsplash.com/photo-1603561591411-07134e71a2a9'
  ]
};

const subcategoriesMap = {
  Rings: ['Solitaire', 'Halo', 'Eternity', 'Vintage', 'Cocktail', 'Band', 'Gemstone', 'Stacking', 'Signet', 'Toi et Moi'],
  Necklaces: ['Temple', 'Choker', 'Princess', 'Lariat', 'Tennis', 'Statement', 'Collar', 'Layered', 'Gemstone', 'Floral'],
  Earrings: ['Jhumka', 'Studs', 'Chandbali', 'Hoop', 'Drop', 'Dangle', 'Huggie', 'Ear Cuff', 'Chandelier', 'Threader'],
  Bracelets: ['Tennis', 'Cuff', 'Kada', 'Charm', 'Chain', 'Flex', 'Mesh', 'Slider', 'Bead', 'Station'],
  Bangles: ['Solid Gold Bangle', 'Kada Pair', 'Carved Openable', 'Diamond Studded', 'Rhode Cuff', 'Temple Bangle', 'Meenakari', 'Polki Bangle', 'Filigree', 'Minimalist Band'],
  Chains: ['Rope Chain', 'Figaro', 'Box Chain', 'Curb Link', 'Wheat Chain', 'Anchor Link', 'Singapore', 'Snake Chain', 'Franco', 'Cuban Link'],
  Pendants: ['Religious Motif', 'Solitaire Diamond', 'Gemstone Locket', 'Initial Medallion', 'Heart Pendant', 'Zodiac', 'Tree of Life', 'Floral Motif', 'Geometric', 'Evil Eye']
};

const prefixes = [
  'Royal', 'Imperial', 'Aura', 'Celestial', 'Maharani', 'Nawab', 'Regal', 'Eternal', 'Divine', 'Majestic',
  'Opulent', 'Heritage', 'Sovereign', 'Vedic', 'Radiant', 'Starlight', 'Vintage', 'Modernist', 'Solitaire', 'Kundan',
  'Meenakari', 'Polki', 'Elysian', 'Luxe', 'Venetian', 'Florentine', 'Gothic', 'Art Deco', 'Bohemian', 'Minimalist',
  'Baroque', 'Princess', 'Duchess', 'Countess', 'Golden', 'Silver', 'Diamond', 'Emerald', 'Ruby', 'Sapphire',
  'Filigree', 'Intricate', 'Hammered', 'Polished', 'Engraved', 'Braided', 'Woven', 'Twisted', 'Tiered', 'Cluster'
];

const metals = ['GOLD', 'GOLD', 'GOLD', 'SILVER'];
const purities = {
  GOLD: ['22K', '22K', '18K', '24K'],
  SILVER: ['925']
};

const products = [];
let itemCounter = 1;

// Interleave 50 items for each of the 7 categories so "All Fine Jewellery" shows all types
for (let i = 1; i <= 50; i++) {
  categories.forEach((cat, cIdx) => {
    const imgList = webpImages[cat];
    const subCats = subcategoriesMap[cat];
    const prefix = prefixes[(itemCounter - 1) % prefixes.length];
    const sub = subCats[(i - 1) % subCats.length];
    const metalType = metals[itemCounter % metals.length];
    const purityArr = purities[metalType];
    const purity = purityArr[(i + cIdx) % purityArr.length];

    const name = `${prefix} ${purity} ${metalType === 'GOLD' ? 'Gold' : 'Silver'} ${sub} ${cat.slice(0, -1)}`;
    const slug = `${cat.toLowerCase()}-${sub.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${cIdx + 1}-${i}`;

    let weight = 0;
    if (cat === 'Rings') weight = Number((2 + (i % 15) * 0.8).toFixed(2));
    else if (cat === 'Necklaces') weight = Number((15 + (i % 30) * 1.5).toFixed(2));
    else if (cat === 'Earrings') weight = Number((4 + (i % 20) * 0.9).toFixed(2));
    else if (cat === 'Bracelets') weight = Number((8 + (i % 20) * 1.1).toFixed(2));
    else if (cat === 'Bangles') weight = Number((18 + (i % 25) * 1.6).toFixed(2));
    else if (cat === 'Chains') weight = Number((10 + (i % 25) * 1.2).toFixed(2));
    else if (cat === 'Pendants') weight = Number((3 + (i % 12) * 0.7).toFixed(2));

    if (metalType === 'SILVER') weight = Number((weight * 1.2).toFixed(2));

    const makingCharges = metalType === 'GOLD' ? 400 + (i % 10) * 150 : 200 + (i % 5) * 50;
    const wastagePercentage = Number((1.5 + (i % 5) * 0.5).toFixed(1));
    const stoneCharges = (i % 3 === 0) ? (i % 10 + 1) * 800 : 0;
    const isFeatured = i <= 6;
    const isBestSeller = (i % 4 === 0);
    const stock = 5 + (i % 20);
    const sku = `${cat.slice(0, 3).toUpperCase()}-${metalType.slice(0, 3)}-${purity}-${String(i).padStart(3, '0')}`;

    const baseImg = imgList[(i - 1) % imgList.length];

    // Every single product gets a 100% unique image URL string & parameter styling
    const flipParam = (itemCounter % 2 === 0) ? '&flip=h' : '';
    const satVal = ((itemCounter * 17) % 50) - 25;
    const conVal = ((itemCounter * 13) % 40) - 20;
    const expVal = ((itemCounter * 7) % 30) - 15;
    const zoomVal = (1 + (itemCounter % 6) * 0.1).toFixed(2);

    const mainImg = `${baseImg}?auto=format&fit=crop&w=800&q=80&fm=webp&uid=${cat.toLowerCase()}_${i}_${itemCounter}${flipParam}&sat=${satVal}&con=${conVal}&exp=${expVal}&fp-z=${zoomVal}`;

    products.push({
      _id: `prod_${cat.toLowerCase()}_${i}`,
      name,
      slug,
      description: `Exquisite ${prefix} piece crafted in certified ${purity} ${metalType === 'GOLD' ? 'Gold' : 'Silver'}. Features detailed ${sub.toLowerCase()} workmanship with hallmarked authenticity. Perfect for luxury occasions and daily heirloom wear.`,
      category: cat,
      subcategory: sub,
      metalType,
      purity,
      weight,
      makingCharges,
      wastagePercentage,
      stoneCharges,
      gstPercentage: 3.0,
      images: [mainImg],
      stock,
      sku,
      isFeatured,
      isBestSeller
    });

    itemCounter++;
  });
}

module.exports = products;
