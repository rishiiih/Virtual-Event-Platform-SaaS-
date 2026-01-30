import cloudinary from '../config/cloudinary.js';
import User from '../models/User.js';
import { Readable } from 'stream';

/**
 * @route   POST /api/auth/upload-avatar
 * @desc    Upload user avatar to Cloudinary
 * @access  Private
 */
export const uploadAvatar = async (req, res) => {
  try {
    // Check if file exists
    if (!req.file) {
      return res.status(400).json({
        status: 'error',
        message: 'Please upload an image file',
      });
    }

    // Convert buffer to stream for Cloudinary
    const streamUpload = (buffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: 'virtual-event-platform/avatars',
            transformation: [
              { width: 500, height: 500, crop: 'fill', gravity: 'face' },
              { quality: 'auto' },
            ],
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );

        // Create readable stream from buffer
        const readable = Readable.from(buffer);
        readable.pipe(stream);
      });
    };

    // Upload to Cloudinary
    const result = await streamUpload(req.file.buffer);

    // Update user avatar in database
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar: result.secure_url },
      { new: true }
    ).select('-password');

    res.status(200).json({
      status: 'success',
      message: 'Avatar uploaded successfully',
      data: {
        user,
        avatarUrl: result.secure_url,
      },
    });
  } catch (error) {
    console.error('Upload avatar error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to upload avatar',
      error: error.message,
    });
  }
};

/**
 * @route   DELETE /api/auth/delete-avatar
 * @desc    Delete user avatar
 * @access  Private
 */
export const deleteAvatar = async (req, res) => {
  try {
    // Update user avatar to null
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar: null },
      { new: true }
    ).select('-password');

    res.status(200).json({
      status: 'success',
      message: 'Avatar deleted successfully',
      data: { user },
    });
  } catch (error) {
    console.error('Delete avatar error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete avatar',
      error: error.message,
    });
  }
};
