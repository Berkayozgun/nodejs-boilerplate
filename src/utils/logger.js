const winston = require('winston');
const fs = require('fs');
const path = require('path');

const logDir = 'logs';

// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// Default logger for application-specific messages (info, warnings, etc.)
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: path.join(logDir, 'application.log'), level: 'info' })
  ],
});

// Logger for errors (400s and 500s)
const errorLogger = winston.createLogger({
  level: 'error',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: path.join(logDir, 'error.log'), level: 'error' })
  ]
});

// Logger for access logs (all requests)
const accessLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: path.join(logDir, 'access.log') })
  ]
});

// Logger for security events (e.g., 403 Forbidden errors)
const securityLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: path.join(logDir, 'security.log') })
  ]
});

// If we're not in production then log to the `console`
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
  errorLogger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
  securityLogger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

module.exports = { logger, errorLogger, accessLogger, securityLogger };
