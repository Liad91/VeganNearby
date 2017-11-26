const mongoose = require('mongoose');
const config = require('./../index');

module.exports = () => {
  /** Set mongoose promise library */
  mongoose.Promise = global.Promise;

  /** Connect to MongoDB */
  mongoose.connect(config.dbUrl, { useMongoClient: true });

  /** On connection established */
  mongoose.connection.once('connected', () => {
    console.log(`Connected to database ${config.dbUrl}`);
  })

  /** Handle connection error */
  mongoose.connection.on('error', console.error.bind(console, 'Connection error:'));
}
