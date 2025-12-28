const mongoose = require('mongoose');
const { logger, errorLogger } = require('../utils/logger');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    errorLogger.error(`Error: ${err.message}`, { stack: err.stack });
    process.exit(1);
  }
};

module.exports = connectDB;
