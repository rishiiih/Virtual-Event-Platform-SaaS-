import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyRegistrations } from '../utils/eventApi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const MyRegistrationsPage = () => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const toast = useToast();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('registered');

  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      fetchRegistrations();
    }
  }, [isAuthenticated, authLoading, filter]);

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const result = await getMyRegistrations({ status: filter });
      setRegistrations(result.data.registrations);
    } catch (error) {
      toast.error('Failed to load registrations');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-light via-white to-accent-light flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-primary-dark mb-4">Please login to view your registrations</h1>
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
          <div className="mb-12">
            <h1 className="text-5xl md:text-6xl font-bold text-primary-dark mb-4">
              My <span className="text-accent">Registrations</span>
            </h1>
            <p className="text-xl text-primary-dark/70">View and manage your event registrations</p>
          </div>

          {/* Filter Tabs */}
          <div className="bg-white rounded-2xl border border-primary/10 shadow-subtle p-2 mb-8 inline-flex gap-2">
            <button
              onClick={() => setFilter('registered')}
              className={`px-6 py-2.5 rounded-xl font-semibold transition-all ${
                filter === 'registered'
                  ? 'bg-accent text-white'
                  : 'text-primary-dark hover:bg-light'
              }`}
            >
              Upcoming
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

          {/* Registrations List */}
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-accent border-t-transparent"></div>
              <p className="text-primary-dark mt-4 font-medium">Loading registrations...</p>
            </div>
          ) : registrations.length === 0 ? (
            <div className="text-center py-20">
              <div className="mb-6">
                <svg className="w-20 h-20 mx-auto text-primary-dark/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <p className="text-primary-dark text-xl font-semibold mb-2">No {filter} registrations</p>
              <p className="text-primary-dark/60 mb-6">
                {filter === 'registered' ? 'Start exploring events to register' : 'You haven\'t cancelled any registrations'}
              </p>
              {filter === 'registered' && (
                <Link
                  to="/events"
                  className="inline-block px-6 py-3 bg-accent text-white hover:bg-accent/90 rounded-xl transition-all duration-200 font-semibold shadow-md hover:shadow-lg"
                >
                  Browse Events
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {registrations.filter(reg => reg.event).map((registration) => (
                <Link
                  key={registration._id}
                  to={`/events/${registration.event._id}`}
                  className="group bg-white rounded-2xl border border-primary/10 shadow-subtle hover:shadow-subtle-lg transition-all duration-300 overflow-hidden"
                >
                  {/* Event Header */}
                  <div className="h-40 bg-gradient-to-br from-primary via-mauve-shadow to-accent p-6 flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/50 to-accent/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative z-10">
                      <span className={`inline-block px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide ${
                        registration.status === 'registered' 
                          ? 'bg-green-500/80 text-white' 
                          : 'bg-red-500/80 text-white'
                      }`}>
                        {registration.status}
                      </span>
                    </div>
                    <h3 className="relative z-10 text-white text-xl font-bold line-clamp-2">{registration.event.title}</h3>
                  </div>

                  {/* Event Body */}
                  <div className="p-6">
                    <p className="text-primary-dark/70 text-sm line-clamp-2 mb-4">{registration.event.description}</p>

                    {/* Date */}
                    <div className="flex items-center text-primary-dark text-sm mb-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-primary to-mauve-shadow rounded-lg flex items-center justify-center mr-3">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <span className="font-medium">{formatDate(registration.event.startDate)}</span>
                    </div>

                    {/* Registration Info */}
                    <div className="flex justify-between items-center pt-4 border-t border-primary/10">
                      <span className="text-primary-dark/60 text-sm">
                        Registered: {formatDate(registration.registeredAt)}
                      </span>
                      {registration.paymentStatus !== 'free' && (
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                          registration.paymentStatus === 'completed' 
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {registration.paymentStatus}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default MyRegistrationsPage;
