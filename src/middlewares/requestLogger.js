const { accessLogger } = require('../utils/logger');

const requestLogger = (req, res, next) => {
    accessLogger.info({
        method: req.method,
        url: req.originalUrl,
        ip: req.ip,
        timestamp: new Date().toISOString()
    });
    next();
};

module.exports = requestLogger;

