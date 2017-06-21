const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');

const users = require('./routes/users');
const config = require('./config/database');

const app = express();
const port = 3000;

// Connect to MongoDB
mongoose.connect(config.database);

// On connection established
mongoose.connection.once('connected', () => {
  console.log(`Connected to database ${config.database}`);
})

// Handle connection error
mongoose.connection.on('error', console.error.bind(console, 'Connection error:'));

// Enable CORS - Cross Origin Resource Sharing
app.use(cors());

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Parse incoming requests
app.use(bodyParser.json());

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

// Set routes
app.use('/users', users);

// Catch 404
app.use((req, res, next) => {
  const err = new Error('Not found');
  err.status = 404;
  next(err);
});

// Error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    success: false,
    message: err.message
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
