import { validationResult } from 'express-validator';

/**
 * Middleware to check for validation errors
 * Should be used after express-validator rules
 */
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const errorDetails = errors.array().map(err => ({
      field: err.path || err.param,
      message: err.msg
    }));
    
    return res.status(400).json({
      status: 'error',
      message: `Validation failed: ${errorDetails.map(e => `${e.field} - ${e.message}`).join(', ')}`,
      errors: errorDetails
    });
  }
  
  next();
};
