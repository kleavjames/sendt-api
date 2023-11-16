const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const hpp = require('hpp');
const xss = require('xss-clean');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');

const errorHandler = require('./middlewares/error');
const connectDB = require('./config/db');

const authRoutes = require('./routes/auth');

// load env
require('dotenv').config()

const app = express();
const port = process.env.PORT || 3000;

// Body parser
app.use(express.json());
// set security headers
app.use(helmet());
// prevent XSS attacks
app.use(xss());
// prevent http param pollution
app.use(hpp());
// enable cors
app.use(cors());
// sanitize
app.use(mongoSanitize());

// connect to database
connectDB();

// dev logger middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// routes
app.use('/api/v1', authRoutes);

// custom error handler middleware
app.use(errorHandler);

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

process.on('unhandledRejection', (err, promise) => {
  console.log(`Logged Error: ${err.message}`);
  server.close(() => process.exit(1));
}); 