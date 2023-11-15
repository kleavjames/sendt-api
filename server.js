const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const errorHandler = require('./middlewares/error');
const connectDB = require('./config/db');

const authRoutes = require('./routes/auth');

// load env
require('dotenv').config()

const app = express();
const port = process.env.PORT || 3000;

// Body parser
app.use(express.json());
// enable cors
app.use(cors());

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