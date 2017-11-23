const mongoose = require('mongoose');
const config = require('./index');

module.exports = () => {
  /** Connect to MongoDB */
  mongoose.connect(config.db);

  /** On connection established */
  mongoose.connection.once('connected', () => {
    console.log(`Connected to database ${config.db}`);
  })

  /** Handle connection error */
  mongoose.connection.on('error', console.error.bind(console, 'Connection error:'));
}
