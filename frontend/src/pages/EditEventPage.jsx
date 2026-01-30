import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { getEvent, updateEvent } from '../utils/eventApi';

const EditEventPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const toast = useToast();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    eventType: 'online',
    startDate: '',
    endDate: '',
    location: '',
    capacity: '',
    price: 0,
    tags: '',
    registrationDeadline: '',
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchEvent();
    }
  }, [isAuthenticated, id]);

  const fetchEvent = async () => {
    try {
      setLoading(true);
      const response = await getEvent(id);
      const event = response.data.event;

      // Format dates for datetime-local input
      const formatDateForInput = (date) => {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
      };

      setFormData({
        title: event.title,
        description: event.description,
        category: event.category,
        eventType: event.eventType,
        startDate: formatDateForInput(event.startDate),
        endDate: formatDateForInput(event.endDate),
        location: event.location,
        capacity: event.capacity,
        price: event.price,
        tags: event.tags.join(', '),
        registrationDeadline: formatDateForInput(event.registrationDeadline),
      });
    } catch (error) {
      toast.error('Failed to load event details');
      console.error(error);
      navigate('/my-dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);

      // Format data
      const eventData = {
        ...formData,
        capacity: parseInt(formData.capacity),
        price: parseFloat(formData.price),
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      };

      await updateEvent(id, eventData);
      toast.success('Event updated successfully!');
      navigate(`/events/${id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update event');
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-light via-white to-accent-light flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-primary-dark mb-4">Please login to edit events</h1>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-light via-white to-accent-light flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-accent border-t-transparent"></div>
          <p className="text-primary-dark mt-4 font-medium">Loading event...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-light via-white to-accent-light">
      <section className="pt-32 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-5xl md:text-6xl font-bold text-primary-dark mb-4">
              Edit <span className="text-accent">Event</span>
            </h1>
            <p className="text-xl text-primary-dark/70">Update your event details</p>
          </div>

          {/* Form */}
          <div className="bg-white rounded-2xl border border-primary/10 shadow-subtle-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-semibold text-primary-dark mb-2">
                  Event Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-primary/20 rounded-lg focus:outline-none focus:border-accent transition-colors bg-white text-primary-dark"
                  placeholder="e.g., Web Development Workshop"
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-semibold text-primary-dark mb-2">
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  required
                  rows="5"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-primary/20 rounded-lg focus:outline-none focus:border-accent transition-colors bg-white text-primary-dark resize-none"
                  placeholder="Describe your event in detail..."
                />
              </div>

              {/* Category and Event Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="category" className="block text-sm font-semibold text-primary-dark mb-2">
                    Category *
                  </label>
                  <select
                    id="category"
                    name="category"
                    required
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-primary/20 rounded-lg focus:outline-none focus:border-accent transition-colors bg-white text-primary-dark"
                  >
                    <option value="">Select category</option>
                    <option value="Technology">Technology</option>
                    <option value="Business">Business</option>
                    <option value="Arts">Arts</option>
                    <option value="Science">Science</option>
                    <option value="Education">Education</option>
                    <option value="Health">Health</option>
                    <option value="Sports">Sports</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="eventType" className="block text-sm font-semibold text-primary-dark mb-2">
                    Event Type *
                  </label>
                  <select
                    id="eventType"
                    name="eventType"
                    required
                    value={formData.eventType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-primary/20 rounded-lg focus:outline-none focus:border-accent transition-colors bg-white text-primary-dark"
                  >
                    <option value="online">Online</option>
                    <option value="in-person">In-Person</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>
              </div>

              {/* Start and End Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="startDate" className="block text-sm font-semibold text-primary-dark mb-2">
                    Start Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    id="startDate"
                    name="startDate"
                    required
                    value={formData.startDate}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-primary/20 rounded-lg focus:outline-none focus:border-accent transition-colors bg-white text-primary-dark"
                  />
                </div>

                <div>
                  <label htmlFor="endDate" className="block text-sm font-semibold text-primary-dark mb-2">
                    End Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    id="endDate"
                    name="endDate"
                    required
                    value={formData.endDate}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-primary/20 rounded-lg focus:outline-none focus:border-accent transition-colors bg-white text-primary-dark"
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label htmlFor="location" className="block text-sm font-semibold text-primary-dark mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  required
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-primary/20 rounded-lg focus:outline-none focus:border-accent transition-colors bg-white text-primary-dark"
                  placeholder={formData.eventType === 'online' ? 'e.g., Zoom, Google Meet' : 'e.g., 123 Main St, City'}
                />
              </div>

              {/* Capacity and Price */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="capacity" className="block text-sm font-semibold text-primary-dark mb-2">
                    Capacity *
                  </label>
                  <input
                    type="number"
                    id="capacity"
                    name="capacity"
                    required
                    min="1"
                    value={formData.capacity}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-primary/20 rounded-lg focus:outline-none focus:border-accent transition-colors bg-white text-primary-dark"
                    placeholder="Maximum attendees"
                  />
                </div>

                <div>
                  <label htmlFor="price" className="block text-sm font-semibold text-primary-dark mb-2">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-primary/20 rounded-lg focus:outline-none focus:border-accent transition-colors bg-white text-primary-dark"
                    placeholder="0 for free events"
                  />
                </div>
              </div>

              {/* Registration Deadline */}
              <div>
                <label htmlFor="registrationDeadline" className="block text-sm font-semibold text-primary-dark mb-2">
                  Registration Deadline *
                </label>
                <input
                  type="datetime-local"
                  id="registrationDeadline"
                  name="registrationDeadline"
                  required
                  value={formData.registrationDeadline}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-primary/20 rounded-lg focus:outline-none focus:border-accent transition-colors bg-white text-primary-dark"
                />
              </div>

              {/* Tags */}
              <div>
                <label htmlFor="tags" className="block text-sm font-semibold text-primary-dark mb-2">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-primary/20 rounded-lg focus:outline-none focus:border-accent transition-colors bg-white text-primary-dark"
                  placeholder="e.g., workshop, beginner-friendly, networking"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-6 py-3 bg-accent text-white hover:bg-accent/90 rounded-xl transition-all duration-200 font-semibold shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Updating...' : 'Update Event'}
                </button>
                <button
                  type="button"
                  onClick={() => navigate(`/events/${id}`)}
                  className="px-6 py-3 border-2 border-accent text-accent hover:bg-accent hover:text-white rounded-xl transition-all duration-200 font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EditEventPage;
