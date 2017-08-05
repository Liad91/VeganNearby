const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const logger = require('morgan');
const cors = require('cors');
const session = require('express-session')

const mongoose = require('mongoose');
const createFiles = require('./create-files');
const auth = require('./routes/auth');
const users = require('./routes/users');
const yelp = require('./routes/yelp');
const db = require('./config/db');
const initializePassport = require('./middlewares/passport');

const app = express();
const port = 3000;

// Build file structure
createFiles();

// Connect to MongoDB
mongoose.connect(db.url);

// On connection established
mongoose.connection.once('connected', () => {
  console.log(`Connected to database ${db.url}`);
})

// Handle connection error
mongoose.connection.on('error', console.error.bind(console, 'Connection error:'));

// Set logger
app.use(logger('dev'));

// Enable CORS - Cross Origin Resource Sharing
app.use(cors());

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Parse incoming requests
app.use(bodyParser.json({limit: '1mb'}));

app.use(session({
  secret: 'long',
  resave: true,
  saveUninitialized: true
}));

// initialize Passport
initializePassport();

// Set routes
app.use('/auth', auth);
app.use('/users', users);
app.use('/yelp', yelp);

// Catch 404
app.use((req, res, next) => {
  const err = new Error('Not found');
  err.type = 'not-found';
  err.status = 404;
  next(err);
});

// Error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    type: err.type || 'server',
    message: err.message
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
