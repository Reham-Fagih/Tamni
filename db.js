const mongoose = require('mongoose');
require('dotenv').config();
const connect = mongoose.connect(process.env.MONGO_URL);

console.log('Attempting to connect to the database...');

connect
  .then(() => {
    console.log('Database connected successfully');
  })
  .catch((error) => {
    console.error('Database connection error:', error);
  });

const LoginSchema = new mongoose.Schema({
  name: {
    type: String, 
    required: true
  },
  password: {
    type: String,
    required: true
  }
});


const collection = mongoose.model('Users', LoginSchema);

module.exports = collection;