import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen">
          <Navbar />
          
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            
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
      </Router>
    </AuthProvider>
  );
}

export default App;
