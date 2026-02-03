import api from './api';

/**
 * Start a live stream for an event (Organizer only)
 */
export const startStream = async (eventId) => {
  const response = await api.post(`/stream/${eventId}/start`);
  return response.data;
};

/**
 * Stop a live stream for an event (Organizer only)
 */
export const stopStream = async (eventId) => {
  const response = await api.post(`/stream/${eventId}/stop`);
  return response.data;
};

/**
 * Join a live stream (get access token)
 */
export const joinStream = async (eventId) => {
  const response = await api.post(`/stream/${eventId}/join`);
  return response.data;
};

/**
 * Get stream status for an event
 */
export const getStreamStatus = async (eventId) => {
  const response = await api.get(`/stream/${eventId}/status`);
  return response.data;
};
