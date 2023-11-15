const express = require('express');
const cors = require('cors');

const connectDB = require('./config/db');

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

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

process.on('unhandledRejection', (err, promise) => {
  console.log(`Logged Error: ${err.message}`);
  server.close(() => process.exit(1));
}); 