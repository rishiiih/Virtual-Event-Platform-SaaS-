import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { createEvent } from '../utils/eventApi';

const CreateEventPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const toast = useToast();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    eventType: 'webinar',
    locationType: 'online',
    startDate: '',
    endDate: '',
    venue: '',
    maxAttendees: '',
    price: 0,
    tags: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error('Please login to create events');
      navigate('/login');
      return;
    }

    // Validate dates
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    
    if (end <= start) {
      toast.error('End date must be after start date');
      return;
    }
    
    if (start < new Date()) {
      toast.error('Start date cannot be in the past');
      return;
    }

    try {
      setLoading(true);

      // Format data
      const eventData = {
        title: formData.title,
        description: formData.description,
        category: formData.category.toLowerCase(),
        eventType: formData.eventType,
        startDate: formData.startDate,
        endDate: formData.endDate,
        maxAttendees: parseInt(formData.maxAttendees) || null,
        price: parseFloat(formData.price),
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        location: {
          type: formData.locationType,
          venue: formData.venue
        },
        status: 'published'
      };

      const response = await createEvent(eventData);
      toast.success('Event created successfully!');
      navigate(`/events/${response.data.event._id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create event');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-light via-white to-accent-light flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-primary-dark mb-4">Please login to create events</h1>
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
              Create <span className="text-accent">Event</span>
            </h1>
            <p className="text-xl text-primary-dark/70">Share your event with the community</p>
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
                    <option value="technology">Technology</option>
                    <option value="business">Business</option>
                    <option value="education">Education</option>
                    <option value="health">Health</option>
                    <option value="entertainment">Entertainment</option>
                    <option value="other">Other</option>
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
                    <option value="webinar">Webinar</option>
                    <option value="conference">Conference</option>
                    <option value="workshop">Workshop</option>
                    <option value="meetup">Meetup</option>
                    <option value="seminar">Seminar</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              {/* Location Type */}
              <div>
                <label htmlFor="locationType" className="block text-sm font-semibold text-primary-dark mb-2">
                  Location Type *
                </label>
                <select
                  id="locationType"
                  name="locationType"
                  required
                  value={formData.locationType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-primary/20 rounded-lg focus:outline-none focus:border-accent transition-colors bg-white text-primary-dark"
                >
                  <option value="online">Online</option>
                  <option value="physical">Physical</option>
                  <option value="hybrid">Hybrid</option>
                </select>
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

              {/* Venue/Location */}
              <div>
                <label htmlFor="venue" className="block text-sm font-semibold text-primary-dark mb-2">
                  Venue/Location *
                </label>
                <input
                  type="text"
                  id="venue"
                  name="venue"
                  required
                  value={formData.venue}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-primary/20 rounded-lg focus:outline-none focus:border-accent transition-colors bg-white text-primary-dark"
                  placeholder={formData.locationType === 'online' ? 'e.g., Zoom, Google Meet' : 'e.g., 123 Main St, City'}
                />
              </div>

              {/* Capacity and Price */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="maxAttendees" className="block text-sm font-semibold text-primary-dark mb-2">
                    Max Attendees
                  </label>
                  <input
                    type="number"
                    id="maxAttendees"
                    name="maxAttendees"
                    min="1"
                    value={formData.maxAttendees}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-primary/20 rounded-lg focus:outline-none focus:border-accent transition-colors bg-white text-primary-dark"
                    placeholder="Leave empty for unlimited"
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
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-accent text-white hover:bg-accent/90 rounded-xl transition-all duration-200 font-semibold shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Creating...' : 'Create Event'}
                </button>
                <button
                  type="button"
                  onClick={() => navigate(-1)}
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

export default CreateEventPage;
