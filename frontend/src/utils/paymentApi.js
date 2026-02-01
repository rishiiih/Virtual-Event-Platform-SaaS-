import api from './api';

// Create Razorpay order
export const createOrder = async (eventId) => {
  const response = await api.post('/payment/create-order', { eventId });
  return response.data;
};

// Verify payment after successful transaction
export const verifyPayment = async (paymentData) => {
  const response = await api.post('/payment/verify', paymentData);
  return response.data;
};

// Get user's payment history
export const getPaymentHistory = async () => {
  const response = await api.get('/payment/history');
  return response.data;
};

// Cancel pending payment
export const cancelPayment = async (registrationId) => {
  const response = await api.delete(`/payment/cancel/${registrationId}`);
  return response.data;
};
