const express = require('express');
const request = require('request');
const getToken = require('./../middlewares/yelp').getToken;
const router = express.Router();

router.post('/search', getToken, (req, res, next) => {
  const queryParams = req.body;

  if (!queryParams.location && (!queryParams.longitude && !queryParams.latitude)) {
    const err = new Error('Please specify a location or a latitude and longitude');
    return next(err);
  }

  Object.assign(queryParams, {categories: 'vegan'});

  const options = {
    method: 'GET',
    uri: 'https://api.yelp.com/v3/businesses/search',
    headers: { authorization: res.yelpToken },
    qs: queryParams
  };

  request(options, (err, response, body) => {
    if (err || response.statusCode !== 200) {
      err.message = 'Yelp search request failed';      
      return next(err);
    }
    body = JSON.parse(body);
    res.send(body);
  });
});

module.exports = router;
