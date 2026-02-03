import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getEvent, registerForEvent, unregisterFromEvent, checkRegistration } from '../utils/eventApi';
import { createOrder, verifyPayment } from '../utils/paymentApi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import ChatRoom from '../components/ChatRoom';

// Load Razorpay script
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const EventDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const toast = useToast();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [activeTab, setActiveTab] = useState('details'); // 'details' or 'chat'

  useEffect(() => {
    fetchEvent();
  }, [id]);

  useEffect(() => {
    if (isAuthenticated && event) {
      checkUserRegistration();
    }
  }, [isAuthenticated, event]);

  const checkUserRegistration = async () => {
    try {
      const registered = await checkRegistration(id);
      setIsRegistered(registered);
    } catch (error) {
      console.error('Failed to check registration:', error);
    }
  };

  const fetchEvent = async () => {
    try {
      setLoading(true);
      const result = await getEvent(id);
      setEvent(result.data.event);
    } catch (error) {
      toast.error('Failed to load event');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!isAuthenticated) {
      toast.info('Please login to register for events');
      navigate('/login');
      return;
    }

    try {
      setRegistering(true);
      
      // Check if event requires payment
      if (event.price > 0) {
        // Load Razorpay script
        const scriptLoaded = await loadRazorpayScript();
        
        if (!scriptLoaded) {
          toast.error('Failed to load payment gateway');
          setRegistering(false);
          return;
        }

        // Create order
        const orderResult = await createOrder(id);
        const { orderId, amount, currency, keyId, registration, userDetails } = orderResult.data;

        // Razorpay options
        const options = {
          key: keyId,
          amount: amount,
          currency: currency,
          name: 'VirtualEvents',
          description: registration.eventTitle,
          order_id: orderId,
          prefill: {
            name: userDetails.name,
            email: userDetails.email
          },
          theme: {
            color: '#8B5FBF'
          },
          handler: async function (response) {
            try {
              // Verify payment on backend
              const verifyResult = await verifyPayment({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                registrationId: registration.id
              });

              // Don't show toast here - PaymentSuccessPage will show it
              navigate(`/payment/success?payment_id=${response.razorpay_payment_id}&registration_id=${registration.id}`);
            } catch (error) {
              toast.error('Payment verification failed');
              console.error(error);
            }
          },
          modal: {
            ondismiss: function() {
              setRegistering(false);
              toast.info('Payment cancelled');
            }
          }
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
      } else {
        // Free event - register directly
        await registerForEvent(id);
        toast.success('Successfully registered for event!');
        setIsRegistered(true);
        fetchEvent(); // Refresh to update attendee count
        setRegistering(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to register');
      setRegistering(false);
    }
  };

  const handleUnregister = async () => {
    try {
      setRegistering(true);
      await unregisterFromEvent(id);
      toast.success('Successfully unregistered from event');
      setIsRegistered(false);
      fetchEvent(); // Refresh to update attendee count
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to unregister');
    } finally {
      setRegistering(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-light via-white to-accent-light flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-accent border-t-transparent mb-4"></div>
          <p className="text-primary-dark font-medium">Loading event...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-light via-white to-accent-light flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-primary-dark mb-4">Event not found</h1>
          <Link to="/events" className="text-accent hover:text-accent/80 font-medium">
            ← Back to Events
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-light via-white to-accent-light py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link to="/events" className="inline-flex items-center text-primary hover:text-accent transition-colors mb-8 font-medium">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Events
        </Link>

        {/* Event Header */}
        <div className="bg-gradient-to-br from-primary via-mauve-shadow to-accent rounded-2xl p-8 md:p-12 mb-8 text-white">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-sm font-bold uppercase tracking-wide">
              {event.eventType}
            </span>
            <span className="px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold">
              {event.category}
            </span>
            <span className={`px-4 py-1.5 rounded-full text-sm font-semibold ${
              event.price === 0 ? 'bg-green-500/80' : 'bg-white/20 backdrop-blur-sm'
            }`}>
              {event.price === 0 ? 'FREE' : `₹${event.price}`}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{event.title}</h1>
          <p className="text-white/90 text-lg mb-6">{event.description}</p>
          
          {/* Organizer */}
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mr-3">
              {event.organizer.avatar ? (
                <img src={event.organizer.avatar} alt={event.organizer.name} className="w-full h-full rounded-full object-cover" />
              ) : (
                <span className="text-xl font-bold">{event.organizer.name.charAt(0)}</span>
              )}
            </div>
            <div>
              <p className="text-sm text-white/70">Organized by</p>
              <p className="font-semibold">{event.organizer.name}</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            {/* Event Details */}
            <div className="bg-white rounded-2xl border border-primary/10 shadow-subtle p-6">
              <h2 className="text-2xl font-bold text-primary-dark mb-6">Event Details</h2>
              
              <div className="space-y-4">
                {/* Date & Time */}
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-mauve-shadow rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary-dark mb-1">Date & Time</h3>
                    <p className="text-primary-dark/70">{formatDate(event.startDate)}</p>
                    <p className="text-primary-dark/70">{formatTime(event.startDate)} - {formatTime(event.endDate)}</p>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-gradient-to-br from-mauve-shadow to-accent rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary-dark mb-1">Location</h3>
                    {event.location.type === 'online' ? (
                      <p className="text-primary-dark/70">Online Event</p>
                    ) : event.location.type === 'physical' ? (
                      <>
                        <p className="text-primary-dark/70">{event.location.venue}</p>
                        <p className="text-primary-dark/70">{event.location.address}</p>
                        <p className="text-primary-dark/70">{event.location.city}, {event.location.country}</p>
                      </>
                    ) : (
                      <p className="text-primary-dark/70">Hybrid Event (Online & In-Person)</p>
                    )}
                  </div>
                </div>

                {/* Capacity */}
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-gradient-to-br from-accent to-primary rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary-dark mb-1">Capacity</h3>
                    <p className="text-primary-dark/70">{event.currentAttendees} / {event.maxAttendees} attendees</p>
                    {event.isFull && (
                      <span className="inline-block mt-1 px-3 py-1 bg-red-100 text-red-700 text-sm rounded-full font-medium">
                        Event Full
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Tags */}
            {event.tags && event.tags.length > 0 && (
              <div className="bg-white rounded-2xl border border-primary/10 shadow-subtle p-6">
                <h2 className="text-2xl font-bold text-primary-dark mb-4">Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {event.tags.map((tag, index) => (
                    <span key={index} className="px-4 py-2 bg-light border border-primary/20 rounded-lg text-primary-dark text-sm font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-2xl border border-primary/10 shadow-subtle p-6 sticky top-24">
              <div className="text-center mb-6">
                <p className="text-4xl font-bold text-accent mb-2">
                  {event.price === 0 ? 'FREE' : `₹${event.price}`}
                </p>
                {event.price > 0 && (
                  <p className="text-primary-dark/70 text-sm">per person</p>
                )}
              </div>

              {event.organizer._id === user?._id ? (
                <div className="space-y-3">
                  {/* Live Streaming Button for Organizer */}
                  <Link
                    to={`/events/${id}/stream`}
                    className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl font-semibold text-center flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg"
                  >
                    {event.isLive ? (
                      <>
                        <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                        Manage Live Stream
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                        </svg>
                        Go Live
                      </>
                    )}
                  </Link>
                  <Link
                    to="/my-dashboard"
                    className="w-full px-6 py-3 bg-gradient-to-br from-primary to-mauve-shadow text-white rounded-xl font-semibold text-center block hover:opacity-90 transition-opacity shadow-md"
                  >
                    Manage Event
                  </Link>
                </div>
              ) : isAuthenticated ? (
                isRegistered ? (
                  <div className="space-y-3">
                    {/* Live Stream Button - Show if event is live */}
                    {event.isLive && (
                      <Link
                        to={`/events/${id}/stream`}
                        className="w-full px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold text-center flex items-center justify-center gap-2 hover:from-red-600 hover:to-red-700 transition-all shadow-md hover:shadow-lg animate-pulse"
                      >
                        <span className="w-2 h-2 bg-white rounded-full"></span>
                        Join Live Stream
                      </Link>
                    )}
                    <div className="w-full px-6 py-3 bg-green-50 border-2 border-green-500 text-green-700 rounded-xl font-semibold text-center">
                      ✓ Registered
                    </div>
                    <button
                      onClick={handleUnregister}
                      disabled={registering}
                      className="w-full px-6 py-3 border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all duration-200 font-semibold disabled:opacity-50"
                    >
                      {registering ? 'Processing...' : 'Cancel Registration'}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleRegister}
                    disabled={registering || event.isFull}
                    className="w-full px-6 py-3 bg-accent text-white hover:bg-accent/90 rounded-xl transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                  >
                    {registering ? 'Registering...' : event.isFull ? 'Event Full' : 'Register Now'}
                  </button>
                )
              ) : (
                <Link
                  to="/login"
                  className="block w-full px-6 py-3 text-center bg-accent text-white hover:bg-accent/90 rounded-xl transition-all duration-200 font-semibold shadow-md hover:shadow-lg"
                >
                  Login to Register
                </Link>
              )}

              <div className="mt-6 pt-6 border-t border-primary/10 space-y-3 text-sm text-primary-dark/70">
                <div className="flex justify-between">
                  <span>Status</span>
                  <span className="font-semibold text-primary-dark capitalize">{event.status}</span>
                </div>
                <div className="flex justify-between">
                  <span>Attendees</span>
                  <span className="font-semibold text-primary-dark">{event.currentAttendees}</span>
                </div>
                {event.price > 0 && (
                  <div className="flex justify-between">
                    <span>Currency</span>
                    <span className="font-semibold text-primary-dark">{event.currency}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs for Details and Chat */}
        {isAuthenticated && (isRegistered || event.organizer._id === user?._id) && (
          <div className="mt-8">
            {/* Tab Navigation */}
            <div className="bg-white rounded-t-2xl border border-primary/10 border-b-0 shadow-subtle">
              <div className="flex">
                <button
                  onClick={() => setActiveTab('details')}
                  className={`flex-1 px-6 py-4 font-semibold transition-all rounded-tl-2xl ${
                    activeTab === 'details'
                      ? 'bg-gradient-to-br from-primary to-mauve-shadow text-white'
                      : 'text-primary-dark hover:bg-light'
                  }`}
                >
                  📋 Event Info
                </button>
                <button
                  onClick={() => setActiveTab('chat')}
                  className={`flex-1 px-6 py-4 font-semibold transition-all rounded-tr-2xl ${
                    activeTab === 'chat'
                      ? 'bg-gradient-to-br from-primary to-mauve-shadow text-white'
                      : 'text-primary-dark hover:bg-light'
                  }`}
                >
                  💬 Live Chat
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="bg-white rounded-b-2xl border border-primary/10 shadow-subtle p-6">
              {activeTab === 'details' && (
                <div>
                  <h3 className="text-2xl font-bold text-primary-dark mb-4">Additional Information</h3>
                  <div className="space-y-4 text-primary-dark/80">
                    <div className="flex justify-between py-3 border-b border-primary/10">
                      <span className="font-medium">Event Type:</span>
                      <span className="capitalize">{event.eventType}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-primary/10">
                      <span className="font-medium">Category:</span>
                      <span className="capitalize">{event.category}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-primary/10">
                      <span className="font-medium">Location Type:</span>
                      <span className="capitalize">{event.location?.type}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-primary/10">
                      <span className="font-medium">Venue:</span>
                      <span>{event.location?.venue || 'TBA'}</span>
                    </div>
                    {event.maxAttendees && (
                      <div className="flex justify-between py-3 border-b border-primary/10">
                        <span className="font-medium">Capacity:</span>
                        <span>{event.currentAttendees} / {event.maxAttendees}</span>
                      </div>
                    )}
                    {event.tags && event.tags.length > 0 && (
                      <div className="py-3">
                        <span className="font-medium block mb-2">Tags:</span>
                        <div className="flex flex-wrap gap-2">
                          {event.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm font-medium"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'chat' && (
                <div>
                  <ChatRoom eventId={id} />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventDetailPage;
