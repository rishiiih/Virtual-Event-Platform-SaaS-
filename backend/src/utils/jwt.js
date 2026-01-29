import jwt from 'jsonwebtoken';

/**
 * Generate JWT token for a user
 * @param {Object} payload - User data to encode in token
 * @returns {String} JWT token
 */
export const generateToken = (payload) => {
  return jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

/**
 * Verify JWT token
 * @param {String} token - JWT token to verify
 * @returns {Object} Decoded token payload
 */
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

/**
 * Create token response object
 * @param {Object} user - User object
 * @returns {Object} Token and user data
 */
export const createTokenResponse = (user) => {
  const payload = {
    id: user._id,
    email: user.email,
    role: user.role
  };

  const token = generateToken(payload);

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar
    }
  };
};
