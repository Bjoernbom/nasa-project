const mongoose = require('mongoose');

require('dotenv').config();

const MONGO_URL = process.env.MONGO_URL

console.log("MONGO_URL",MONGO_URL)

mongoose.connection.once('open', () => {
  console.log("MongoDB connection ready!")
});

mongoose.connection.on('error', (err) => {
  console.error("MongoDB error", err)
});

const mongoConnect = async () => {
  await mongoose.connect(MONGO_URL);
};

const mongoDisconnect = async () => {
  await mongoose.disconnect()
};

module.exports = {
  mongoConnect,
  mongoDisconnect
}