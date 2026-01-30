import { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../utils/api';

const AvatarUpload = ({ currentAvatar, onUploadSuccess }) => {
  const [preview, setPreview] = useState(currentAvatar);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const { updateUser } = useAuth();
  const toast = useToast();

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Upload to server
    await uploadAvatar(file);
  };

  const uploadAvatar = async (file) => {
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await api.post('/auth/upload-avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.status === 'success') {
        const { user, avatarUrl } = response.data.data;
        updateUser(user);
        setPreview(avatarUrl);
        if (onUploadSuccess) {
          onUploadSuccess(avatarUrl);
        }
        toast.success('Avatar uploaded successfully!');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to upload avatar');
      setPreview(currentAvatar); // Revert to current avatar
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    setUploading(true);

    try {
      const response = await api.delete('/auth/delete-avatar');

      if (response.data.status === 'success') {
        const { user } = response.data.data;
        updateUser(user);
        setPreview(null);
        if (onUploadSuccess) {
          onUploadSuccess(null);
        }
        toast.success('Avatar removed successfully');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete avatar');
    } finally {
      setUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Avatar Preview */}
      <div className="relative group">
        <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-subtle-lg">
          {preview ? (
            <img
              src={preview}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-5xl font-bold text-white">
              {uploading ? '...' : '?'}
            </span>
          )}
        </div>

        {/* Overlay on hover */}
        {!uploading && (
          <div className="absolute inset-0 bg-primary-dark/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button
              onClick={triggerFileInput}
              className="text-white text-sm font-medium"
            >
              Change Photo
            </button>
          </div>
        )}

        {/* Loading spinner */}
        {uploading && (
          <div className="absolute inset-0 bg-primary-dark/60 rounded-full flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      {/* Upload Input (Hidden) */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        disabled={uploading}
      />

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={triggerFileInput}
          disabled={uploading}
          className="px-5 py-2 border-2 border-primary text-primary hover:bg-primary hover:text-white rounded-lg transition-all duration-200 font-medium disabled:opacity-50"
        >
          Upload Photo
        </button>
        {preview && (
          <button
            onClick={handleDelete}
            disabled={uploading}
            className="px-5 py-2 border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-all duration-200 font-medium disabled:opacity-50"
          >
            Remove
          </button>
        )}
      </div>

      <p className="text-xs text-primary-dark/60">
        Recommended: Square image, max 5MB
      </p>
    </div>
  );
};

export default AvatarUpload;
