import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';

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
            
            {/* Placeholder routes */}
            <Route path="/events" element={
              <div className="pt-24 px-4 text-center">
                <h1 className="text-3xl font-bold text-primary-dark">Events Coming Soon</h1>
              </div>
            } />
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
