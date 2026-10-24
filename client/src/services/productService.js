import API from './api';
import { clientProductsData } from '../data/clientProductsData';
import { calculateClientPricing } from '../utils/pricingCalculator';

export const getProducts = async (params = {}) => {
  try {
    const res = await API.get('/products', { params, timeout: 3000 });
    if (res.data && res.data.success && Array.isArray(res.data.products)) {
      return res.data;
    }
  } catch (err) {
    console.warn('[Client Product Service] API call failed or timed out. Serving instant local catalog.');
  }

  // Instant Fallback Client-side Catalog Logic
  const {
    category = '',
    metalType = '',
    purity = '',
    search = '',
    isFeatured = '',
    isBestSeller = '',
    sort = '',
    page = 1,
    limit = 12,
    minPrice = '',
    maxPrice = ''
  } = params;

  const searchTokens = (search || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  let filtered = clientProductsData.filter((p) => {
    if (category && p.category.toLowerCase() !== category.toLowerCase()) return false;
    if (metalType && p.metalType.toUpperCase() !== metalType.toUpperCase()) return false;
    if (purity && p.purity.toUpperCase() !== purity.toUpperCase()) return false;
    if (isFeatured === 'true' && !p.isFeatured) return false;
    if (isBestSeller === 'true' && !p.isBestSeller) return false;

    if (searchTokens.length > 0) {
      const targetStr = `${p.name} ${p.description || ''} ${p.category} ${p.subcategory || ''} ${p.metalType} ${p.purity} ${p.sku}`.toLowerCase();
      const matchesAll = searchTokens.every((tok) => {
        const t = tok.toLowerCase();
        const root = t.endsWith('s') && t.length > 3 ? t.slice(0, -1) : t;
        return targetStr.includes(t) || targetStr.includes(root);
      });
      if (!matchesAll) return false;
    }

    return true;
  });

  const activeRates = {
    GOLD_24K: { ratePerGram: 7250 },
    GOLD_22K: { ratePerGram: 6645 },
    GOLD_18K: { ratePerGram: 5437 },
    SILVER_925: { ratePerGram: 88 }
  };

  let calculatedProducts = filtered.map((prod) => {
    const priceInfo = calculateClientPricing(prod, activeRates);
    return {
      ...prod,
      dynamicPricing: priceInfo,
      price: priceInfo ? priceInfo.finalPrice : 50000,
    };
  });

  if (minPrice || maxPrice) {
    const min = Number(minPrice) || 0;
    const max = Number(maxPrice) || Infinity;
    calculatedProducts = calculatedProducts.filter((p) => p.price >= min && p.price <= max);
  }

  if (sort === 'price_asc') {
    calculatedProducts.sort((a, b) => a.price - b.price);
  } else if (sort === 'price_desc') {
    calculatedProducts.sort((a, b) => b.price - a.price);
  } else if (sort === 'weight_desc') {
    calculatedProducts.sort((a, b) => b.weight - a.weight);
  }

  const totalCount = calculatedProducts.length;
  const pageNum = Number(page) || 1;
  const limitNum = Number(limit) || 12;
  const startIndex = (pageNum - 1) * limitNum;
  const paginatedProducts = calculatedProducts.slice(startIndex, startIndex + limitNum);

  return {
    success: true,
    count: totalCount,
    totalPages: Math.ceil(totalCount / limitNum) || 1,
    currentPage: pageNum,
    products: paginatedProducts,
    ratesMap: activeRates
  };
};

export const getProductById = async (id) => {
  try {
    const res = await API.get(`/products/${id}`, { timeout: 2000 });
    if (res.data && res.data.success) {
      return res.data;
    }
  } catch (err) {
    console.warn('[Client Product Service] API getProductById failed. Using local dataset.');
  }

  const product = clientProductsData.find((p) => p._id === id || p.slug === id) || clientProductsData[0];
  const activeRates = {
    GOLD_24K: { ratePerGram: 7250 },
    GOLD_22K: { ratePerGram: 6645 },
    GOLD_18K: { ratePerGram: 5437 },
    SILVER_925: { ratePerGram: 88 }
  };
  const priceInfo = calculateClientPricing(product, activeRates);

  return {
    success: true,
    product: {
      ...product,
      dynamicPricing: priceInfo,
      price: priceInfo ? priceInfo.finalPrice : 50000,
    }
  };
};

export const getCategories = async () => {
  try {
    const res = await API.get('/products/categories', { timeout: 2000 });
    if (res.data && res.data.success) {
      return res.data;
    }
  } catch (err) {}

  return {
    success: true,
    categories: [
      { name: 'Rings', slug: 'rings' },
      { name: 'Necklaces', slug: 'necklaces' },
      { name: 'Earrings', slug: 'earrings' },
      { name: 'Bracelets', slug: 'bracelets' },
      { name: 'Bangles', slug: 'bangles' },
      { name: 'Chains', slug: 'chains' },
      { name: 'Pendants', slug: 'pendants' },
    ]
  };
};

export const getMetalRates = async () => {
  try {
    const res = await API.get('/metals/rates', { timeout: 2000 });
    if (res.data && res.data.success) {
      return res.data;
    }
  } catch (err) {}

  return {
    success: true,
    rates: {
      GOLD_24K: { ratePerGram: 7250 },
      GOLD_22K: { ratePerGram: 6645 },
      GOLD_18K: { ratePerGram: 5437 },
      SILVER_925: { ratePerGram: 88 }
    }
  };
};
