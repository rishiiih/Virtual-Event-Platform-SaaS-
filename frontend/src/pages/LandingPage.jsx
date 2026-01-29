import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-light via-white to-accent-light">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-white border border-primary/20 rounded-full mb-8 shadow-subtle">
              <span className="w-2 h-2 bg-accent rounded-full mr-2 animate-pulse"></span>
              <span className="text-sm text-primary-dark font-medium">Platform built for modern events</span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl md:text-7xl font-bold text-primary-dark mb-6 leading-tight">
              Host Virtual Events
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-mauve-shadow to-accent">
                That Actually Engage
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl text-primary-dark/70 mb-12 max-w-2xl mx-auto leading-relaxed">
              Create multi-track virtual events with live streaming, real-time chat, and interactive polls. 
              All on free-tier infrastructure.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {isAuthenticated ? (
                <Link
                  to="/events"
                  className="px-8 py-4 border-2 border-accent text-accent hover:bg-accent hover:text-white rounded-lg transition-all duration-200 font-medium text-lg"
                >
                  Browse Events
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="px-8 py-4 border-2 border-accent text-accent hover:bg-accent hover:text-white rounded-lg transition-all duration-200 font-medium text-lg"
                  >
                    Get Started Free
                  </Link>
                  <Link
                    to="/login"
                    className="px-8 py-4 border-2 border-primary text-primary hover:bg-primary hover:text-white rounded-lg transition-all duration-200 font-medium text-lg"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary-dark mb-4">Everything you need</h2>
            <p className="text-lg text-primary-dark/70">Powerful features for organizers and attendees</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-2xl border border-primary/10 shadow-subtle hover:shadow-subtle-lg transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-mauve-shadow rounded-xl mb-6 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-primary-dark mb-3">Live Streaming</h3>
              <p className="text-primary-dark/70">HD video streaming with third-party SDK integration. No server load.</p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-2xl border border-primary/10 shadow-subtle hover:shadow-subtle-lg transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-br from-mauve-shadow to-accent rounded-xl mb-6 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-primary-dark mb-3">Real-time Chat</h3>
              <p className="text-primary-dark/70">Session-based chat rooms with Socket.io. No message leakage.</p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-2xl border border-primary/10 shadow-subtle hover:shadow-subtle-lg transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-br from-accent to-primary rounded-xl mb-6 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-primary-dark mb-3">Ticket Management</h3>
              <p className="text-primary-dark/70">Stripe integration for payments. Automatic access control.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12 text-center">
            <div>
              <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent mb-2">
                ₹0
              </div>
              <div className="text-primary-dark/70">Hosting Cost</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-mauve-shadow to-accent mb-2">
                100%
              </div>
              <div className="text-primary-dark/70">Free Tier</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-accent to-primary mb-2">
                ∞
              </div>
              <div className="text-primary-dark/70">Possibilities</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-primary-dark mb-6">Ready to create your first event?</h2>
          <p className="text-xl text-primary-dark/70 mb-8">
            Join organizers who are already hosting engaging virtual events.
          </p>
          {!isAuthenticated && (
            <Link
              to="/register"
              className="inline-block px-10 py-5 border-2 border-accent text-accent hover:bg-accent hover:text-white rounded-lg transition-all duration-200 font-medium text-lg"
            >
              Start for Free
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
