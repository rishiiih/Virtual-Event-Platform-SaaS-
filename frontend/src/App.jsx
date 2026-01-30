import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import EventsPage from './pages/EventsPage';
import EventDetailPage from './pages/EventDetailPage';
import MyRegistrationsPage from './pages/MyRegistrationsPage';
import CreateEventPage from './pages/CreateEventPage';
import EditEventPage from './pages/EditEventPage';
import OrganizerDashboard from './pages/OrganizerDashboard';

function App() {
  return (
    <Router>
      <ToastProvider>
        <AuthProvider>
          <div className="min-h-screen">
            <Navbar />
          
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/events/:id" element={<EventDetailPage />} />
            <Route path="/my-registrations" element={<MyRegistrationsPage />} />
            <Route path="/create-event" element={<CreateEventPage />} />
            <Route path="/events/:id/edit" element={<EditEventPage />} />
            <Route path="/my-dashboard" element={<OrganizerDashboard />} />
            
            {/* Placeholder routes */}
            <Route path="/about" element={
              <div className="pt-24 px-4 text-center">
                <h1 className="text-3xl font-bold text-primary-dark">About Coming Soon</h1>
              </div>
            } />
          </Routes>
        </div>
      </AuthProvider>
    </ToastProvider>
    </Router>
  );
}

export default App;
