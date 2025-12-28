const express = require('express');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');
const errorHandler = require('./middlewares/errorHandler');
const requestLogger = require('./middlewares/requestLogger');
const auth = require('./routes/auth');
const notes = require('./routes/notes');
const { errorLogger } = require('./utils/logger');

const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger');

const app = express();

// Enable CORS for all routes and origins
app.use(cors());

// Set security HTTP headers
app.use(helmet());

// Request logger
app.use(requestLogger);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(hpp());

// Limit requests from same API
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000, // 1 hour
    message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);

// Mount routers
app.use('/api/v1/auth', auth);
app.use('/api/v1/notes', notes);

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Test Route
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Global Error Handler
app.use((err, req, res, next) => {
    errorLogger.error(err.message, { stack: err.stack, method: req.method, url: req.originalUrl });
    errorHandler(err, req, res, next);
});

module.exports = app;
