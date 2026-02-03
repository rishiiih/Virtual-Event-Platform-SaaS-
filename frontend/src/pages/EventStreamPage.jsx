import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getEvent } from '../utils/eventApi';
import { startStream, stopStream, joinStream, getStreamStatus } from '../utils/streamApi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import LiveStream from '../components/LiveStream';
import ChatRoom from '../components/ChatRoom';

const EventStreamPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const toast = useToast();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [streamData, setStreamData] = useState(null);
  const [isInStream, setIsInStream] = useState(false);
  const [isOrganizer, setIsOrganizer] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      toast.info('Please login to access the stream');
      navigate('/login');
      return;
    }
    if (user) {
      fetchEvent();
      checkStreamStatus();
    }
  }, [id, isAuthenticated, user]);

  const fetchEvent = async () => {
    try {
      setLoading(true);
      const result = await getEvent(id);
      const eventData = result.data.event;
      setEvent(eventData);
      // Convert both IDs to strings for proper comparison
      const organizerId = eventData.organizer?._id?.toString() || eventData.organizer?.toString();
      const userId = user?._id?.toString(); // Changed from user?.id to user?._id
      setIsOrganizer(organizerId === userId);
      console.log('Organizer check:', { organizerId, userId, isOrganizer: organizerId === userId });
    } catch (error) {
      toast.error('Failed to load event');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const checkStreamStatus = async () => {
    try {
      const status = await getStreamStatus(id);
      if (status.isLive) {
        console.log('Stream is live:', status);
      }
    } catch (error) {
      console.error('Failed to check stream status:', error);
    }
  };

  const handleStartStream = async () => {
    try {
      toast.info('Starting stream...');
      const result = await startStream(id);
      setStreamData(result.stream);
      setIsInStream(true);
      toast.success('Stream started successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to start stream');
      console.error(error);
    }
  };

  const handleStopStream = async () => {
    try {
      await stopStream(id);
      setStreamData(null);
      setIsInStream(false);
      toast.success('Stream stopped');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to stop stream');
      console.error(error);
    }
  };

  const handleJoinStream = async () => {
    try {
      toast.info('Joining stream...');
      const result = await joinStream(id);
      setStreamData(result.stream);
      setIsInStream(true);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to join stream');
      console.error(error);
    }
  };

  const handleLeaveStream = () => {
    setIsInStream(false);
    setStreamData(null);
    toast.info('Left stream');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-light via-white to-accent-light flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-primary-dark">Loading...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-light via-white to-accent-light flex items-center justify-center">
        <div className="text-center text-primary-dark">
          <h2 className="text-2xl font-bold mb-4">Event not found</h2>
          <Link to="/events" className="text-primary hover:underline">
            Back to events
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-light via-white to-accent-light py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            to={`/events/${id}`}
            className="inline-flex items-center text-primary-dark hover:text-primary transition-colors mb-4"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Event Details
          </Link>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-primary-dark mb-2">{event.title}</h1>
              <p className="text-gray-600">Live Stream</p>
            </div>
            
            {/* Stream Status Badge */}
            <div className="flex items-center gap-2">
              {event.isLive && (
                <span className="flex items-center gap-2 px-4 py-2 bg-red-500 rounded-full text-white font-semibold animate-pulse">
                  <span className="w-3 h-3 bg-white rounded-full"></span>
                  LIVE
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Video Area */}
          <div className="lg:col-span-2">
            {isInStream && streamData ? (
              /* Live Stream Component */
              <div className="h-[600px]">
                <LiveStream
                  channelName={streamData.channelName}
                  token={streamData.token}
                  appId={streamData.appId}
                  onLeave={handleLeaveStream}
                  isOrganizer={isOrganizer}
                />
              </div>
            ) : (
              /* Pre-Stream State */
              <div className="bg-white rounded-xl shadow-subtle p-12 h-[600px] flex flex-col items-center justify-center text-center border border-gray-100">
                {event.isLive && event.stream?.channelName ? (
                  /* Stream is active - show join option */
                  <>
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-6 shadow-lg">
                      <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-primary-dark mb-4">
                      Stream is live!
                    </h2>
                    <p className="text-gray-600 mb-8">
                      {isOrganizer 
                        ? 'Your stream is active. Click below to enter the broadcast room.'
                        : 'Click the button below to watch the stream'
                      }
                    </p>
                    <button
                      onClick={handleJoinStream}
                      className="px-8 py-3 bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-white font-semibold rounded-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                      {isOrganizer ? 'Enter Broadcast Room' : 'Watch Stream'}
                    </button>
                  </>
                ) : (
                  /* Stream not started - show start option for organizer */
                  <>
                    <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-6">
                      <svg className="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-primary-dark mb-4">
                      {isOrganizer ? 'Ready to go live?' : 'Stream not started yet'}
                    </h2>
                    <p className="text-gray-600 mb-8">
                      {isOrganizer 
                        ? 'Start the live stream to connect with your attendees'
                        : 'The organizer hasn\'t started the stream yet. Check back soon!'
                      }
                    </p>
                    {isOrganizer && (
                      <button
                        onClick={handleStartStream}
                        className="px-8 py-3 bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-white font-semibold rounded-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
                      >
                        Start Stream
                      </button>
                    )}
                  </>
                )}
              </div>
            )}

            {/* Organizer Controls (when in stream) */}
            {isInStream && isOrganizer && (
              <div className="mt-4 bg-white rounded-xl shadow-subtle border border-gray-100 p-4">
                <button
                  onClick={handleStopStream}
                  className="w-full px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors shadow-md hover:shadow-lg"
                >
                  End Stream for Everyone
                </button>
              </div>
            )}
          </div>

          {/* Chat Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-subtle border border-gray-100 p-4 h-[600px] flex flex-col">
              <h3 className="text-xl font-bold text-primary-dark mb-4">Live Chat</h3>
              <div className="flex-1 overflow-hidden">
                <ChatRoom eventId={id} />
              </div>
            </div>
          </div>
        </div>

        {/* Event Info */}
        <div className="mt-8 bg-white rounded-xl shadow-subtle border border-gray-100 p-6">
          <h3 className="text-xl font-bold text-primary-dark mb-4">About this event</h3>
          <p className="text-gray-600">{event.description}</p>
          <div className="mt-4 flex flex-wrap gap-4 text-gray-600 text-sm">
            <div>
              <span className="font-semibold text-primary-dark">Organizer:</span> {event.organizer.name}
            </div>
            <div>
              <span className="font-semibold text-primary-dark">Category:</span> {event.category}
            </div>
            <div>
              <span className="font-semibold text-primary-dark">Type:</span> {event.eventType}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventStreamPage;
