const express = require('express');
const yelp = require('yelp-fusion');
const config = require('../../config');
const Featured = require('../models/featured');

const router = express.Router();
const client = yelp.client(config.yelp.apiKey);

router.post('/search', (req, res, next) => {
  const { body } = req;

  if (!body.location && (!body.longitude || !body.latitude)) {
    const err = new Error('Please specify a location or a latitude and longitude');
    return next(err);
  }

  Object.assign(body, { term: 'vegan' });

  client.search(body)
    .then(response => res.send(response.jsonBody))
    .catch(err => next(err));
});

router.get('/business', (req, res, next) => {
  const { id } = req.query;

  if (!id) {
    const err = new Error('Business ID is required');
    return next(err);
  }

  client.business(id)
    .then(response => res.send(response.jsonBody))
    .catch(err => next(err));
});

router.get('/reviews', (req, res, next) => {
  const { id } = req.query;

  if (!id) {
    const err = new Error('Business ID is required');
    return next(err);
  }

  client.reviews(id)
    .then(response => res.send(response.jsonBody))
    .catch(err => next(err));
});

router.get('/featured', (req, res, next) => {
  Featured.findOne({}, { places: 1, _id: 0 })
    .then(doc => res.status(200).json({ places: doc.places }))
    .catch(err => next(err));
});

module.exports = router;
