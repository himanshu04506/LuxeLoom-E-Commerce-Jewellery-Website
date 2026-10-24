import API from './api';

export const registerUser = async (data) => {
  const res = await API.post('/auth/register', data);
  return res.data;
};

export const loginUser = async (data) => {
  const res = await API.post('/auth/login', data);
  return res.data;
};

export const getMe = async () => {
  const res = await API.get('/auth/me');
  return res.data;
};

export const updateProfile = async (data) => {
  const res = await API.put('/auth/profile', data);
  return res.data;
};
