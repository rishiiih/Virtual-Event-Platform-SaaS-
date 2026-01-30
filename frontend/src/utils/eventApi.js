import api from './api';

// Get all events with filters
export const getEvents = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const response = await api.get(`/events${queryString ? `?${queryString}` : ''}`);
  return response.data;
};

// Get single event
export const getEvent = async (id) => {
  const response = await api.get(`/events/${id}`);
  return response.data;
};

// Create event (organizer only)
export const createEvent = async (eventData) => {
  const response = await api.post('/events', eventData);
  return response.data;
};

// Update event
export const updateEvent = async (id, eventData) => {
  const response = await api.put(`/events/${id}`, eventData);
  return response.data;
};

// Update event status
export const updateEventStatus = async (id, status) => {
  const response = await api.patch(`/events/${id}/status`, { status });
  return response.data;
};

// Delete event
export const deleteEvent = async (id) => {
  const response = await api.delete(`/events/${id}`);
  return response.data;
};

// Get organizer's events
export const getMyEvents = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const response = await api.get(`/events/my/organized${queryString ? `?${queryString}` : ''}`);
  return response.data;
};

// Register for event
export const registerForEvent = async (id) => {
  const response = await api.post(`/events/${id}/register`);
  return response.data;
};

// Unregister from event
export const unregisterFromEvent = async (id) => {
  const response = await api.delete(`/events/${id}/register`);
  return response.data;
};

// Get event registrations (organizer only)
export const getEventRegistrations = async (id, params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const response = await api.get(`/events/${id}/registrations${queryString ? `?${queryString}` : ''}`);
  return response.data;
};

// Get my registrations
export const getMyRegistrations = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const response = await api.get(`/registrations/my-events${queryString ? `?${queryString}` : ''}`);
  return response.data;
};

// Check if user is registered for an event
export const checkRegistration = async (eventId) => {
  try {
    const response = await getMyRegistrations({ status: 'registered' });
    const registrations = response.data.registrations || [];
    return registrations.some(reg => reg.event._id === eventId || reg.event === eventId);
  } catch (error) {
    return false;
  }
};
