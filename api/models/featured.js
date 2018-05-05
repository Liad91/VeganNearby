const mongoose = require('mongoose');

const featuredSchema = new mongoose.Schema({
  places: [String]
});

module.exports = mongoose.model('Featured', featuredSchema, 'featured');