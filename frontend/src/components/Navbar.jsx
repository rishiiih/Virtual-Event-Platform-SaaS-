import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Modal from './Modal';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [hideNavbar, setHideNavbar] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
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
    <>
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
              <div className="relative">
                {/* User Profile Button */}
                <button
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-primary/5 transition-colors"
                >
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover border-2 border-primary"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center border-2 border-primary">
                      <span className="text-white text-sm font-bold">
                        {user?.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <span className="text-primary-dark font-medium">{user?.name}</span>
                  <svg 
                    className={`w-4 h-4 text-primary-dark transition-transform ${showUserDropdown ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {showUserDropdown && (
                  <>
                    {/* Backdrop to close dropdown */}
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setShowUserDropdown(false)}
                    />
                    
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-subtle-lg border border-primary/10 py-2 z-20">
                      <Link
                        to="/profile"
                        onClick={() => setShowUserDropdown(false)}
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-primary/5 transition-colors text-primary-dark"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span className="font-medium">Profile</span>
                      </Link>

                      <Link
                        to="/my-dashboard"
                        onClick={() => setShowUserDropdown(false)}
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-primary/5 transition-colors text-primary-dark"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="font-medium">My Events</span>
                      </Link>

                      <Link
                        to="/my-registrations"
                        onClick={() => setShowUserDropdown(false)}
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-primary/5 transition-colors text-primary-dark"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <span className="font-medium">Registrations</span>
                      </Link>

                      <div className="h-px bg-primary/10 my-2" />

                      <Link
                        to="/settings"
                        onClick={() => setShowUserDropdown(false)}
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-primary/5 transition-colors text-primary-dark"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="font-medium">Settings</span>
                      </Link>

                      <div className="h-px bg-primary/10 my-2" />

                      <button
                        onClick={() => {
                          setShowUserDropdown(false);
                          setShowLogoutModal(true);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 transition-colors text-red-600"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span className="font-medium">Logout</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
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

    {/* Logout Confirmation Modal */}
    <Modal
      isOpen={showLogoutModal}
      onClose={() => setShowLogoutModal(false)}
      onConfirm={() => {
        logout();
        navigate('/');
        toast.info('Logged out successfully');
      }}
      title="Logout Confirmation"
      message="Are you sure you want to logout?"
      confirmText="Logout"
      cancelText="Cancel"
      confirmColor="red"
    />
  </>
  );
};

export default Navbar;
