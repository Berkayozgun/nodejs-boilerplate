const { errorLogger, securityLogger } = require('../utils/logger');
const User = require('../models/User');

const errorHandler = async (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;



  // Mongoose Bad ObjectId
  if (err.name === 'CastError') {
    const message = `Resource not found with id of ${err.value}`;
    error = new Error(message);
    error.statusCode = 404;
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = new Error(message);
    error.statusCode = 400;
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message);
    error = new Error(message);
    error.statusCode = 400;
  }

  // Log 403 Forbidden errors to security.log
  if (error.statusCode === 403 && req.user) {
    const user = await User.findById(req.user.id);
    securityLogger.info(`Forbidden Access: User ID: ${req.user.id}, Email: ${user ? user.email : 'N/A'}, URL: ${req.originalUrl}, IP: ${req.ip}, Message: ${error.message}`);
  }

  // Continue to log all 500 errors to error.log (handled in app.js for global catch)
  // Other errors (like 400, 404, etc.) are already handled by response status below

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error',
    ...(process.env.NODE_ENV !== 'production' && { stack: error.stack }) // Only send stack in dev
  });
};

module.exports = errorHandler;
