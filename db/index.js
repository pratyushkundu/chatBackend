// db.js
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://pratyushkundu:pratyushkundu@cluster0.7xfhqjx.mongodb.net/chatApp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});
