export const calculateClientPricing = (product, activeRates) => {
  if (!product) return null;

  let ratePerGram = 6645;
  const metal = (product.metalType || 'GOLD').toUpperCase();
  const purity = (product.purity || '22K').toUpperCase();

  if (metal === 'SILVER') {
    ratePerGram = activeRates?.SILVER_925?.ratePerGram || 88;
  } else {
    if (purity.includes('24')) ratePerGram = activeRates?.GOLD_24K?.ratePerGram || 7250;
    else if (purity.includes('18')) ratePerGram = activeRates?.GOLD_18K?.ratePerGram || 5437;
    else ratePerGram = activeRates?.GOLD_22K?.ratePerGram || 6645;
  }

  const weight = Number(product.weight) || 0;
  const makingCharges = Number(product.makingCharges) || 0;
  const wastagePercentage = Number(product.wastagePercentage) || 0;
  const stoneCharges = Number(product.stoneCharges) || 0;
  const gstPercentage = Number(product.gstPercentage) || 3.0;

  const baseMetalPrice = Math.round(weight * ratePerGram);
  const wastageCharges = Math.round((baseMetalPrice * wastagePercentage) / 100);
  const subtotal = baseMetalPrice + makingCharges + wastageCharges + stoneCharges;
  const gst = Math.round((subtotal * gstPercentage) / 100);
  const finalPrice = Math.round(subtotal + gst);

  return {
    ratePerGram,
    weight,
    baseMetalPrice,
    makingCharges,
    wastagePercentage,
    wastageCharges,
    stoneCharges,
    subtotal,
    gstPercentage,
    gst,
    finalPrice,
  };
};
