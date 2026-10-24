export const formatINR = (amount) => {
  const num = Number(amount) || 0;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(num);
};

export const formatGram = (weight) => {
  const num = Number(weight) || 0;
  return `${num.toFixed(1)}g`;
};
