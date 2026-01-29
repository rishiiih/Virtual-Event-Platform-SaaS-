import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [hideNavbar, setHideNavbar] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      setScrolled(currentScrollY > 20);
      
      // Hide navbar on scroll down, show on scroll up
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setHideNavbar(true);
      } else {
        setHideNavbar(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Check if on login or register page
  const isSplitPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        hideNavbar && isSplitPage ? '-translate-y-full' : 'translate-y-0'
      } ${
        isSplitPage
          ? ''
          : scrolled 
            ? 'bg-white/70 backdrop-blur-xl shadow-subtle border-b border-primary/10' 
            : 'bg-transparent backdrop-blur-sm'
      }`}
    >
      <div className="w-full px-8 lg:px-16 relative z-10">
        <div className="flex justify-between items-center h-16">
          {/* Logo - Far Left */}
          <Link to="/" className="flex items-center space-x-2">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isSplitPage ? 'bg-white/30 backdrop-blur-sm' : 'bg-gradient-to-br from-primary to-accent'}`}>
              <span className="text-white font-bold text-lg">V</span>
            </div>
            <span className={`text-xl font-semibold ${isSplitPage ? 'text-white' : 'text-primary-dark'}`}>VirtualEvents</span>
          </Link>

          {/* Navigation Links - Right side with normal spacing */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/events" className={`${isSplitPage ? 'text-primary-dark' : 'text-primary-dark'} hover:text-primary transition-colors font-medium relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-primary after:transition-all after:duration-300`}>
              Events
            </Link>
            <Link to="/about" className={`${isSplitPage ? 'text-primary-dark' : 'text-primary-dark'} hover:text-primary transition-colors font-medium relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-primary after:transition-all after:duration-300`}>
              About
            </Link>
            
            {isAuthenticated ? (
              <>
                {user?.role === 'organizer' && (
                  <Link to="/dashboard" className="text-primary-dark hover:text-primary transition-colors font-medium relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-primary after:transition-all after:duration-300">
                    Dashboard
                  </Link>
                )}
                <Link to="/profile" className="text-primary-dark hover:text-primary transition-colors font-medium relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-primary after:transition-all after:duration-300">
                  Profile
                </Link>
                <button
                  onClick={logout}
                  className="px-6 py-2.5 border-2 border-accent text-accent hover:bg-accent hover:text-white rounded-lg transition-all duration-200 font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-6 py-2.5 border-2 border-primary text-primary hover:bg-primary hover:text-white rounded-lg transition-all duration-200 font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-2.5 border-2 border-accent text-accent hover:bg-accent hover:text-white rounded-lg transition-all duration-200 font-medium"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="text-primary-dark hover:text-primary">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
