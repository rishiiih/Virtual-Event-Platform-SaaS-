import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
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

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-light via-white to-accent-light pt-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-subtle-lg p-8 border border-primary/10 mb-8">
          <div className="flex items-center space-x-6">
            {/* Avatar */}
            <div className="w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
              <span className="text-4xl font-bold text-white">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>

            {/* User Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-primary-dark mb-2">{user.name}</h1>
              <p className="text-primary-dark/70 mb-1">{user.email}</p>
              <span className="inline-block px-3 py-1 bg-accent/10 text-accent rounded-full text-sm font-medium capitalize">
                {user.role}
              </span>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="bg-white rounded-2xl shadow-subtle-lg p-8 border border-primary/10">
          <h2 className="text-2xl font-bold text-primary-dark mb-6">Account Information</h2>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-primary/10">
              <span className="text-primary-dark/70">User ID</span>
              <span className="text-primary-dark font-mono text-sm">{user.id || user._id}</span>
            </div>
            
            <div className="flex justify-between items-center py-3 border-b border-primary/10">
              <span className="text-primary-dark/70">Account Status</span>
              <span className="text-green-600 font-medium">Active</span>
            </div>
            
            <div className="flex justify-between items-center py-3 border-b border-primary/10">
              <span className="text-primary-dark/70">Member Since</span>
              <span className="text-primary-dark">
                {new Date(user.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex gap-4">
            <button className="px-6 py-3 border-2 border-primary text-primary hover:bg-primary hover:text-white rounded-lg transition-all duration-200 font-medium">
              Edit Profile
            </button>
            {user.role === 'organizer' && (
              <button className="px-6 py-3 border-2 border-accent text-accent hover:bg-accent hover:text-white rounded-lg transition-all duration-200 font-medium">
                Create Event
              </button>
            )}
          </div>
        </div>

        {/* Coming Soon Section */}
        <div className="mt-8 bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-8 border border-primary/20">
          <h3 className="text-xl font-bold text-primary-dark mb-2">Coming Soon</h3>
          <ul className="space-y-2 text-primary-dark/70">
            <li>• Avatar upload (Cloudinary integration)</li>
            <li>• Password change</li>
            <li>• Email notifications settings</li>
            <li>• Two-factor authentication</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
