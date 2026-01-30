import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ChangePassword from '../components/ChangePassword';

const SettingsPage = () => {
  const navigate = useNavigate();
  const { user, loading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
    }
  }, [loading, isAuthenticated, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-light via-white to-accent-light flex items-center justify-center">
        <div className="text-primary-dark">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-light via-white to-accent-light pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary-dark mb-2">Settings</h1>
          <p className="text-primary-dark/70">Manage your account settings and preferences</p>
        </div>

        {/* Settings Sections */}
        <div className="space-y-6">
          {/* Security Section */}
          <div className="bg-white rounded-2xl shadow-subtle-lg border border-primary/10 overflow-hidden">
            <div className="bg-gradient-to-r from-primary/5 to-accent/5 px-6 py-4 border-b border-primary/10">
              <h2 className="text-xl font-bold text-primary-dark flex items-center gap-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Security
              </h2>
              <p className="text-sm text-primary-dark/60 mt-1">Update your password and security settings</p>
            </div>
            <div className="p-6">
              <ChangePassword />
            </div>
          </div>

          {/* Notifications Section (Coming Soon) */}
          <div className="bg-white rounded-2xl shadow-subtle-lg border border-primary/10 overflow-hidden">
            <div className="bg-gradient-to-r from-primary/5 to-accent/5 px-6 py-4 border-b border-primary/10">
              <h2 className="text-xl font-bold text-primary-dark flex items-center gap-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                Notifications
                <span className="ml-2 px-2 py-0.5 bg-accent/20 text-accent text-xs rounded-full">Coming Soon</span>
              </h2>
              <p className="text-sm text-primary-dark/60 mt-1">Manage your notification preferences</p>
            </div>
            <div className="p-6">
              <p className="text-primary-dark/60">Email and push notification settings will be available soon.</p>
            </div>
          </div>

          {/* Privacy Section (Coming Soon) */}
          <div className="bg-white rounded-2xl shadow-subtle-lg border border-primary/10 overflow-hidden">
            <div className="bg-gradient-to-r from-primary/5 to-accent/5 px-6 py-4 border-b border-primary/10">
              <h2 className="text-xl font-bold text-primary-dark flex items-center gap-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Privacy & Data
                <span className="ml-2 px-2 py-0.5 bg-accent/20 text-accent text-xs rounded-full">Coming Soon</span>
              </h2>
              <p className="text-sm text-primary-dark/60 mt-1">Control your privacy and data settings</p>
            </div>
            <div className="p-6">
              <p className="text-primary-dark/60">Privacy settings and data management will be available soon.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
