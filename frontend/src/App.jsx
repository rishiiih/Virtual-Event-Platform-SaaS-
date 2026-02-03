import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { SocketProvider } from './context/SocketContext';

import Navbar from './components/Navbar';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import EventsPage from './pages/EventsPage';
import EventDetailPage from './pages/EventDetailPage';
import EventStreamPage from './pages/EventStreamPage';
import MyRegistrationsPage from './pages/MyRegistrationsPage';
import CreateEventPage from './pages/CreateEventPage';
import EditEventPage from './pages/EditEventPage';
import OrganizerDashboard from './pages/OrganizerDashboard';
import EventAttendeesPage from './pages/EventAttendeesPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import PaymentCancelPage from './pages/PaymentCancelPage';

/**
 * Layout component to control Navbar visibility
 */
const Layout = () => {
  const location = useLocation();

  // Hide navbar on auth pages
  const hideNavbar =
    location.pathname === '/login' ||
    location.pathname === '/register';

  return (
    <div className="min-h-screen">
      {!hideNavbar && <Navbar />}

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/events/:id" element={<EventDetailPage />} />
        <Route path="/events/:id/stream" element={<EventStreamPage />} />
        <Route path="/my-registrations" element={<MyRegistrationsPage />} />
        <Route path="/create-event" element={<CreateEventPage />} />
        <Route path="/events/:id/edit" element={<EditEventPage />} />
        <Route path="/events/:id/attendees" element={<EventAttendeesPage />} />
        <Route path="/my-dashboard" element={<OrganizerDashboard />} />
        <Route path="/payment/success" element={<PaymentSuccessPage />} />
        <Route path="/payment/cancel" element={<PaymentCancelPage />} />

        {/* Placeholder */}
        <Route
          path="/about"
          element={
            <div className="pt-24 px-4 text-center">
              <h1 className="text-3xl font-bold text-primary-dark">
                About Coming Soon
              </h1>
            </div>
          }
        />
      </Routes>
    </div>
  );
};

function App() {
  return (
    <Router>
      <ToastProvider>
        <AuthProvider>
          <SocketProvider>
            <Layout />
          </SocketProvider>
        </AuthProvider>
      </ToastProvider>
    </Router>
  );
}

export default App;
   