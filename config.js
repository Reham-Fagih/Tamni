const mongoose = require('mongoose');

const connect = mongoose.connect('mongodb+srv://nofaos111:nnooNNOO11.@users.k4xvo.mongodb.net/YourDatabaseName?retryWrites=true&w=majority&appName=Users');

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
