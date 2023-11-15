const mongoose = require('mongoose');

const mongoURI = () => {
  const {MONGO_URI_DEV, MONGO_URI_PROD, NODE_EV} = process.env;
  return NODE_EV === 'development' ? MONGO_URI_DEV : MONGO_URI_PROD;
}

const connectDB = async () => {
    const connect = await mongoose.connect(mongoURI());

    console.log(`MongoDB connected: ${connect.connection.host}`);
}

module.exports = connectDB;