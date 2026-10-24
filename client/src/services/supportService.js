import API from './api';

export const getTickets = async () => {
  const res = await API.get('/support');
  return res.data;
};

export const createTicket = async (ticketData) => {
  const res = await API.post('/support', ticketData);
  return res.data;
};

export const getTicketById = async (ticketId) => {
  const res = await API.get(`/support/${ticketId}`);
  return res.data;
};

export const addMessageToTicket = async (ticketId, text) => {
  const res = await API.post(`/support/${ticketId}/messages`, { text });
  return res.data;
};

export const queryChatbot = async (message, orderId = null) => {
  const res = await API.post('/support/chatbot', { message, orderId });
  return res.data;
};
