const app = require('./src/app');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');
const { logger, errorLogger } = require('./src/utils/logger');

// Load env vars
dotenv.config({ path: './.env' });

// Connect to database
connectDB();

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  errorLogger.error(`Error: ${err.message}`, { stack: err.stack });
  // Close server & exit process
  server.close(() => process.exit(1));
});
