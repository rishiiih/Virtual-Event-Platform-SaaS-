import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../utils/api';

const EditProfile = () => {
  const { user, updateUser } = useAuth();
  const toast = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.put('/auth/profile', formData);

      if (response.data.status === 'success') {
        updateUser(response.data.data.user);
        toast.success('Profile updated successfully!');
        setIsEditing(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
    });
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <div className="bg-white rounded-2xl shadow-subtle-lg p-8 border border-primary/10">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-bold text-primary-dark">Profile Information</h2>
          <button
            onClick={() => setIsEditing(true)}
            className="px-5 py-2 border-2 border-primary text-primary hover:bg-primary hover:text-white rounded-lg transition-all duration-200 font-medium"
          >
            Edit Profile
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-primary-dark/70">Name</label>
            <p className="text-lg text-primary-dark font-medium mt-1">{user?.name}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-primary-dark/70">Email</label>
            <p className="text-lg text-primary-dark font-medium mt-1">{user?.email}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-primary-dark/70">Role</label>
            <p className="text-lg text-primary-dark font-medium mt-1 capitalize">{user?.role}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-subtle-lg p-8 border border-primary/10">
      <h2 className="text-2xl font-bold text-primary-dark mb-6">Edit Profile</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-primary-dark mb-2">
            Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border-2 border-primary/30 rounded-lg focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-primary-dark mb-2">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border-2 border-primary/30 rounded-lg focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        {/* Role (Read-only) */}
        <div>
          <label className="block text-sm font-medium text-primary-dark mb-2">
            Role
          </label>
          <input
            type="text"
            value={user?.role}
            disabled
            className="w-full px-4 py-3 border-2 border-primary/20 rounded-lg bg-gray-50 text-primary-dark/60 capitalize cursor-not-allowed"
          />
          <p className="text-xs text-primary-dark/50 mt-1">Role cannot be changed</p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            disabled={loading}
            className="flex-1 py-3 border-2 border-primary/30 text-primary-dark rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
