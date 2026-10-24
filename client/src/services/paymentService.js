import API from './api';

export const verifyPayment = async (paymentData) => {
  const res = await API.post('/payments/verify', paymentData);
  return res.data;
};
