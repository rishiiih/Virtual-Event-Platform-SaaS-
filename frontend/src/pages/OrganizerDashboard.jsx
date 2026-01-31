import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getMyEvents, deleteEvent, updateEventStatus } from '../utils/eventApi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const OrganizerDashboard = () => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, active, cancelled, completed

  useEffect(() => {
    // Only fetch if authenticated and not in auth loading state
    if (isAuthenticated && !authLoading) {
      fetchMyEvents();
    }
  }, [isAuthenticated, authLoading, filter]);

  const fetchMyEvents = async () => {
    try {
      setLoading(true);
      const params = filter !== 'all' ? { status: filter } : {};
      const result = await getMyEvents(params);
      setEvents(result.data.events);
    } catch (error) {
      toast.error('Failed to load your events');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (eventId, eventTitle) => {
    if (!window.confirm(`Are you sure you want to delete "${eventTitle}"?`)) {
      return;
    }

    try {
      await deleteEvent(eventId);
      toast.success('Event deleted successfully');
      fetchMyEvents();
    } catch (error) {
      toast.error('Failed to delete event');
      console.error(error);
    }
  };

  const handleStatusChange = async (eventId, newStatus) => {
    try {
      await updateEventStatus(eventId, newStatus);
      toast.success(`Event ${newStatus} successfully`);
      fetchMyEvents();
    } catch (error) {
      toast.error('Failed to update event status');
      console.error(error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-light via-white to-accent-light flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-primary-dark">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-light via-white to-accent-light flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-primary-dark mb-4">Please login to view your dashboard</h1>
          <Link to="/login" className="text-accent hover:text-accent/80 font-medium">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-light via-white to-accent-light">
      <section className="pt-32 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold text-primary-dark mb-4">
                My <span className="text-accent">Events</span>
              </h1>
              <p className="text-xl text-primary-dark/70">Manage your organized events</p>
            </div>
            <Link
              to="/create-event"
              className="mt-4 md:mt-0 inline-flex items-center px-6 py-3 bg-accent text-white hover:bg-accent/90 rounded-xl transition-all duration-200 font-semibold shadow-md hover:shadow-lg"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Create Event
            </Link>
          </div>

          {/* Filter Tabs */}
          <div className="bg-white rounded-2xl border border-primary/10 shadow-subtle p-2 mb-8 inline-flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-6 py-2.5 rounded-xl font-semibold transition-all ${
                filter === 'all'
                  ? 'bg-accent text-white'
                  : 'text-primary-dark hover:bg-light'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`px-6 py-2.5 rounded-xl font-semibold transition-all ${
                filter === 'active'
                  ? 'bg-accent text-white'
                  : 'text-primary-dark hover:bg-light'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-6 py-2.5 rounded-xl font-semibold transition-all ${
                filter === 'completed'
                  ? 'bg-accent text-white'
                  : 'text-primary-dark hover:bg-light'
              }`}
            >
              Completed
            </button>
            <button
              onClick={() => setFilter('cancelled')}
              className={`px-6 py-2.5 rounded-xl font-semibold transition-all ${
                filter === 'cancelled'
                  ? 'bg-accent text-white'
                  : 'text-primary-dark hover:bg-light'
              }`}
            >
              Cancelled
            </button>
          </div>

          {/* Events List */}
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-accent border-t-transparent"></div>
              <p className="text-primary-dark mt-4 font-medium">Loading events...</p>
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-20">
              <div className="mb-6">
                <svg className="w-20 h-20 mx-auto text-primary-dark/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-primary-dark text-xl font-semibold mb-2">No events found</p>
              <p className="text-primary-dark/60 mb-6">Start by creating your first event</p>
              <Link
                to="/create-event"
                className="inline-block px-6 py-3 bg-accent text-white hover:bg-accent/90 rounded-xl transition-all duration-200 font-semibold shadow-md hover:shadow-lg"
              >
                Create Event
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {events.map((event) => (
                <div key={event._id} className="bg-white rounded-2xl border border-primary/10 shadow-subtle hover:shadow-subtle-lg transition-all duration-300 overflow-hidden">
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                      {/* Event Info */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <Link 
                              to={`/events/${event._id}`}
                              className="text-2xl font-bold text-primary-dark hover:text-accent transition-colors"
                            >
                              {event.title}
                            </Link>
                            <div className="flex flex-wrap gap-2 mt-2">
                              <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                                event.status === 'active' ? 'bg-green-100 text-green-700' :
                                event.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                'bg-gray-100 text-gray-700'
                              }`}>
                                {event.status}
                              </span>
                              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-accent/10 text-accent uppercase tracking-wide">
                                {event.category}
                              </span>
                              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary uppercase tracking-wide">
                                {event.eventType}
                              </span>
                            </div>
                          </div>
                        </div>

                        <p className="text-primary-dark/70 mb-4 line-clamp-2">{event.description}</p>

                        {/* Event Details Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center text-primary-dark">
                            <svg className="w-5 h-5 mr-2 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="font-medium">{formatDate(event.startDate)}</span>
                          </div>

                          <div className="flex items-center text-primary-dark">
                            <svg className="w-5 h-5 mr-2 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <span className="font-medium">{event.registrationsCount || 0} / {event.capacity}</span>
                          </div>

                          <div className="flex items-center text-primary-dark">
                            <svg className="w-5 h-5 mr-2 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="font-medium">{event.price === 0 ? 'Free' : `$${event.price}`}</span>
                          </div>

                          <div className="flex items-center text-primary-dark">
                            <svg className="w-5 h-5 mr-2 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="font-medium truncate">{event.location}</span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex lg:flex-col gap-2 lg:min-w-[140px]">
                        <Link
                          to={`/events/${event._id}/edit`}
                          className="flex-1 lg:flex-none px-4 py-2 border-2 border-accent text-accent hover:bg-accent hover:text-white rounded-lg transition-all duration-200 font-semibold text-center"
                        >
                          Edit
                        </Link>
                        
                        {event.status === 'active' && (
                          <button
                            onClick={() => handleStatusChange(event._id, 'cancelled')}
                            className="flex-1 lg:flex-none px-4 py-2 border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-all duration-200 font-semibold"
                          >
                            Cancel
                          </button>
                        )}

                        <button
                          onClick={() => handleDelete(event._id, event.title)}
                          className="flex-1 lg:flex-none px-4 py-2 bg-red-500 text-white hover:bg-red-600 rounded-lg transition-all duration-200 font-semibold"
                        >
                          Delete
                        </button>

                        <Link
                          to={`/events/${event._id}/registrations`}
                          className="flex-1 lg:flex-none px-4 py-2 bg-primary text-white hover:bg-primary/90 rounded-lg transition-all duration-200 font-semibold text-center"
                        >
                          Attendees
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default OrganizerDashboard;
