const mongoose = require('mongoose');

const connectDB = async () => {
    const connect = await mongoose.connect(process.env.MONGO_URI_PROD);

    console.log(`MongoDB connected: ${connect.connection.host}`);
}

module.exports = connectDB;