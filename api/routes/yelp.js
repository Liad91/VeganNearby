const express = require('express');
const request = require('request');
const config = require('../../config');
const Featured = require('../models/featured');
const router = express.Router();

router.post('/search', (req, res, next) => {
  const queryParams = req.body;

  if (!queryParams.location && (!queryParams.longitude || !queryParams.latitude)) {
    const err = new Error('Please specify a location or a latitude and longitude');
    return next(err);
  }

  Object.assign(queryParams, { term: 'vegan' });

  const options = {
    method: 'GET',
    uri: 'https://api.yelp.com/v3/businesses/search',
    headers: { authorization: `Bearer ${config.yelp.apiKey}` },
    qs: queryParams,
  };

  request(options, (err, response, body) => {
    if (err) {
      err.message = 'Yelp search request failed';
      return next(err);
    }
    if (response.statusCode > 499) {
      const err = new Error('Yelp search request failed');

      return next(err);
    }
    body = JSON.parse(body);
    if (body.error && body.error.code === 'LOCATION_NOT_FOUND') {
      body = {
        total: 0,
        businesses: [],
        region: {
          center: {
            latitude: 0,
            longitude: 0
          }
        },
        error: body.error.code
      }
    }
    res.send(body);
  });
});

router.get('/business', (req, res, next) => {
  if (!req.query['id']) {
    const err = new Error('Business ID is required');
    return next(err);
  }

  const options = {
    method: 'GET',
    uri: `https://api.yelp.com/v3/businesses/${req.query['id']}`,
    headers: { authorization: `Bearer ${config.yelp.apiKey}` }
  };

  request(options, (err, response, body) => {
    if (err) {
      err.message = 'Yelp search request failed';
      return next(err);
    }
    if (response.statusCode > 499) {
      const err = new Error('Yelp search request failed');

      return next(err);
    }
    body = JSON.parse(body);

    if (body.error) {
      return next(err);
    }
    res.send(body);
  });
});

router.get('/featured', (req, res, next) => {
  Featured.findOne({}, { places: 1, _id: 0 })
    .then(doc => {
      res.status(200).json({ places: doc.places });
    })
    .catch(err => next(err));
});

router.get('/reviews', (req, res, next) => {
  if (!req.query['id']) {
    const err = new Error('Business ID is required');
    return next(err);
  }

  const options = {
    method: 'GET',
    uri: `https://api.yelp.com/v3/businesses/${req.query['id']}/reviews`,
    headers: { authorization: `Bearer ${config.yelp.apiKey}` }
  };

  request(options, (err, response, body) => {
    if (err) {
      err.message = 'Yelp search request failed';
      return next(err);
    }
    if (response.statusCode > 499) {
      const err = new Error('Yelp search request failed');

      return next(err);
    }
    body = JSON.parse(body);

    if (body.error) {
      return next(err);
    }
    res.send(body);
  });
});

module.exports = router;
