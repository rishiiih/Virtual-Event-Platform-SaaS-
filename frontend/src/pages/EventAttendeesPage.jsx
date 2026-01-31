import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getEventRegistrations } from '../utils/eventApi';
import { getEvent } from '../utils/eventApi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const EventAttendeesPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();

  const [event, setEvent] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchData();
  }, [id, filter]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch event details
      const eventResult = await getEvent(id);
      setEvent(eventResult.data.event);

      // Check if user is organizer
      if (eventResult.data.event.organizer._id !== user?._id) {
        toast.error('Only the event organizer can view attendees');
        navigate('/organizer/dashboard');
        return;
      }

      // Fetch registrations
      const params = filter !== 'all' ? { status: filter } : {};
      const registrationsResult = await getEventRegistrations(id, params);
      setRegistrations(registrationsResult.data.registrations);
    } catch (error) {
      toast.error('Failed to load attendees');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      registered: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700',
      attended: 'bg-blue-100 text-blue-700',
      waitlist: 'bg-yellow-100 text-yellow-700'
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status] || 'bg-gray-100 text-gray-700'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-light via-white to-accent-light flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-accent border-t-transparent mb-4"></div>
          <p className="text-primary-dark font-medium">Loading attendees...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-light via-white to-accent-light flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-primary-dark mb-4">Event not found</h1>
          <Link to="/organizer/dashboard" className="text-accent hover:text-accent/80 font-medium">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-light via-white to-accent-light">
      <section className="pt-32 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <Link 
            to="/organizer/dashboard" 
            className="inline-flex items-center text-primary-dark hover:text-accent transition-colors mb-8 font-medium"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </Link>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-5xl md:text-6xl font-bold text-primary-dark mb-4">
              Event <span className="text-accent">Attendees</span>
            </h1>
            <p className="text-xl text-primary-dark/70">{event.title}</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl border border-primary/10 shadow-subtle p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-primary-dark/60 mb-1">Total Registered</p>
                  <p className="text-3xl font-bold text-primary-dark">{registrations.length}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-primary/10 shadow-subtle p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-primary-dark/60 mb-1">Confirmed</p>
                  <p className="text-3xl font-bold text-green-600">
                    {registrations.filter(r => r.status === 'registered').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-primary/10 shadow-subtle p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-primary-dark/60 mb-1">Attended</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {registrations.filter(r => r.status === 'attended').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-primary/10 shadow-subtle p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-primary-dark/60 mb-1">Cancelled</p>
                  <p className="text-3xl font-bold text-red-600">
                    {registrations.filter(r => r.status === 'cancelled').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="bg-white rounded-2xl border border-primary/10 shadow-subtle p-2 mb-8 inline-flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-6 py-2.5 rounded-xl font-semibold transition-all ${
                filter === 'all' ? 'bg-accent text-white' : 'text-primary-dark hover:bg-light'
              }`}
            >
              All ({registrations.length})
            </button>
            <button
              onClick={() => setFilter('registered')}
              className={`px-6 py-2.5 rounded-xl font-semibold transition-all ${
                filter === 'registered' ? 'bg-accent text-white' : 'text-primary-dark hover:bg-light'
              }`}
            >
              Confirmed
            </button>
            <button
              onClick={() => setFilter('attended')}
              className={`px-6 py-2.5 rounded-xl font-semibold transition-all ${
                filter === 'attended' ? 'bg-accent text-white' : 'text-primary-dark hover:bg-light'
              }`}
            >
              Attended
            </button>
            <button
              onClick={() => setFilter('cancelled')}
              className={`px-6 py-2.5 rounded-xl font-semibold transition-all ${
                filter === 'cancelled' ? 'bg-accent text-white' : 'text-primary-dark hover:bg-light'
              }`}
            >
              Cancelled
            </button>
          </div>

          {/* Attendees List */}
          <div className="bg-white rounded-2xl border border-primary/10 shadow-subtle overflow-hidden">
            {registrations.length === 0 ? (
              <div className="text-center py-20">
                <svg className="w-20 h-20 mx-auto text-primary-dark/30 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <p className="text-primary-dark text-xl font-semibold mb-2">No attendees yet</p>
                <p className="text-primary-dark/60">Start promoting your event to get registrations</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-br from-primary to-mauve-shadow text-white">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Attendee</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Email</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Registered On</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Payment</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-primary/10">
                    {registrations.map((registration) => (
                      <tr key={registration._id} className="hover:bg-light/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mr-3 overflow-hidden flex-shrink-0">
                              {registration.attendee.avatar ? (
                                <img 
                                  src={registration.attendee.avatar} 
                                  alt={registration.attendee.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <span className="text-white font-bold">
                                  {registration.attendee.name.charAt(0).toUpperCase()}
                                </span>
                              )}
                            </div>
                            <span className="font-medium text-primary-dark">{registration.attendee.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-primary-dark/70">{registration.attendee.email}</td>
                        <td className="px-6 py-4 text-primary-dark/70 text-sm">
                          {formatDate(registration.registeredAt)}
                        </td>
                        <td className="px-6 py-4">
                          {getStatusBadge(registration.status)}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            registration.paymentStatus === 'completed' ? 'bg-green-100 text-green-700' :
                            registration.paymentStatus === 'free' ? 'bg-blue-100 text-blue-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {registration.paymentStatus === 'free' ? 'Free' : 
                             registration.paymentStatus === 'completed' ? 'Paid' : 'Pending'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default EventAttendeesPage;
