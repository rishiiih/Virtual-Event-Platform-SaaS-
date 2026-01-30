import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getEvents } from '../utils/eventApi';
import { useToast } from '../context/ToastContext';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [searchParams, setSearchParams] = useSearchParams();
  const toast = useToast();

  // Get params from URL
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const eventType = searchParams.get('eventType') || '';
  const page = parseInt(searchParams.get('page')) || 1;

  useEffect(() => {
    fetchEvents();
  }, [search, category, eventType, page]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const params = {
        status: 'published',
        page,
        limit: 9
      };
      if (search) params.search = search;
      if (category) params.category = category;
      if (eventType) params.eventType = eventType;

      const result = await getEvents(params);
      setEvents(result.data.events);
      setPagination(result.data.pagination);
    } catch (error) {
      toast.error('Failed to load events');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    newParams.delete('page'); // Reset to page 1 on filter change
    setSearchParams(newParams);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const searchValue = formData.get('search');
    updateFilter('search', searchValue);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-light via-white to-accent-light">
      {/* Header Section */}
      <section className="pt-32 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold text-[#1A1423] mb-4">
              Discover <span className="text-[#B75D69]">Events</span>
            </h1>
            <p className="text-xl text-[#774C60] max-w-2xl mx-auto">Find and join amazing virtual and in-person events</p>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-2xl border border-[#774C60]/20 shadow-lg p-6 mb-12">
            <form onSubmit={handleSearch} className="mb-6">
              <div className="flex gap-3">
                <input
                  type="text"
                  name="search"
                  defaultValue={search}
                  placeholder="Search events by title, description, or tags..."
                  className="flex-1 px-4 py-3 bg-white border-2 border-[#774C60]/30 rounded-xl text-[#1A1423] placeholder-[#774C60] focus:outline-none focus:border-[#B75D69] transition-all"
                />
                <button
                  type="submit"
                  className="px-8 py-3 bg-[#B75D69] text-white hover:bg-[#774C60] rounded-xl transition-all duration-200 font-semibold shadow-md hover:shadow-lg"
                >
                  Search
                </button>
              </div>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Category Filter */}
              <div>
                <label className="block text-[#1A1423] text-sm font-semibold mb-2">Category</label>
                <select
                  value={category}
                  onChange={(e) => updateFilter('category', e.target.value)}
                  className="w-full px-4 py-3 bg-white border-2 border-[#774C60]/30 rounded-xl text-[#1A1423] focus:outline-none focus:border-[#B75D69] transition-all"
                >
                  <option value="">All Categories</option>
                  <option value="technology">Technology</option>
                  <option value="business">Business</option>
                  <option value="education">Education</option>
                  <option value="health">Health</option>
                  <option value="entertainment">Entertainment</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Event Type Filter */}
              <div>
                <label className="block text-[#1A1423] text-sm font-semibold mb-2">Event Type</label>
                <select
                  value={eventType}
                  onChange={(e) => updateFilter('eventType', e.target.value)}
                  className="w-full px-4 py-3 bg-white border-2 border-[#774C60]/30 rounded-xl text-[#1A1423] focus:outline-none focus:border-[#B75D69] transition-all"
                >
                  <option value="">All Types</option>
                  <option value="conference">Conference</option>
                  <option value="workshop">Workshop</option>
                  <option value="webinar">Webinar</option>
                  <option value="meetup">Meetup</option>
                  <option value="seminar">Seminar</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>

        {/* Events Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#B75D69] border-t-transparent"></div>
            <p className="text-[#1A1423] mt-4 font-medium">Loading events...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[#1A1423] text-xl font-semibold">No events found</p>
            <p className="text-[#774C60] mt-2">Try adjusting your search or filters</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {events.map((event) => (
                <Link
                  key={event._id}
                  to={`/events/${event._id}`}
                  className="group bg-white rounded-2xl border border-[#774C60]/20 shadow-lg hover:shadow-xl hover:border-[#B75D69]/40 transition-all duration-300 overflow-hidden"
                >
                  {/* Event Header */}
                  <div className="h-48 bg-gradient-to-br from-[#372549] to-[#774C60] p-6 flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute inset-0 bg-[#1A1423]/0 group-hover:bg-[#1A1423]/20 transition-all duration-300"></div>
                    <div className="relative z-10">
                      <span className="inline-block px-3 py-1.5 bg-[#1A1423]/80 text-[#EACDC2] text-xs font-bold rounded-full uppercase tracking-wide">
                        {event.eventType}
                      </span>
                    </div>
                    <h3 className="relative z-10 text-white text-2xl font-bold line-clamp-2">{event.title}</h3>
                  </div>

                  {/* Event Body */}
                  <div className="p-6 bg-white">
                    <p className="text-[#774C60] text-sm line-clamp-3 mb-4 leading-relaxed">{event.description}</p>

                    {/* Date */}
                    <div className="flex items-center text-[#1A1423] text-sm mb-3">
                      <div className="w-8 h-8 bg-[#372549] rounded-lg flex items-center justify-center mr-3">
                        <svg className="w-4 h-4 text-[#EACDC2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <span className="font-medium">{formatDate(event.startDate)}</span>
                    </div>

                    {/* Location */}
                    <div className="flex items-center text-[#1A1423] text-sm mb-4">
                      <div className="w-8 h-8 bg-[#774C60] rounded-lg flex items-center justify-center mr-3">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <span className="font-medium">{event.location.type === 'online' ? 'Online' : event.location.type === 'physical' ? event.location.city : 'Hybrid'}</span>
                    </div>

                    {/* Price and Attendees */}
                    <div className="flex justify-between items-center pt-4 border-t border-[#774C60]/20">
                      <span className="text-2xl font-bold text-[#B75D69]">
                        {event.price === 0 ? 'FREE' : `$${event.price}`}
                      </span>
                      <span className="text-[#774C60] text-sm font-medium">
                        {event.currentAttendees}/{event.maxAttendees} attending
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex justify-center gap-2">
                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => {
                      const newParams = new URLSearchParams(searchParams);
                      newParams.set('page', pageNum);
                      setSearchParams(newParams);
                    }}
                    className={`px-5 py-2.5 rounded-xl font-semibold transition-all duration-200 ${
                      pageNum === pagination.page
                        ? 'bg-[#B75D69] text-white shadow-md'
                        : 'bg-white text-[#1A1423] border-2 border-[#774C60]/30 hover:border-[#B75D69] hover:bg-[#EACDC2]'
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
        </div>
      </section>
    </div>
  );
};

export default EventsPage;
