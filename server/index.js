require('dotenv/config');
const path = require('path');
const express = require('express');
const errorMiddleware = require('./error-middleware');

const yelp = require('yelp-fusion');
const client = yelp.client(process.env.YELP_API_KEY);

const app = express();
const publicPath = path.join(__dirname, 'public');

if (process.env.NODE_ENV === 'development') {
  app.use(require('./dev-middleware')(publicPath));
} else {
  app.use(express.static(publicPath));
}

app.get('/api/hello', (req, res) => {
  res.json({ hello: 'world' });
});

app.use(errorMiddleware);

app.get('/api/nearby', (req, res, next) => {
  client.search({
    term: 'climbing',
    latitude: 33.6349171,
    longitude: -117.7405465,
    radius: 1000
  })
    .then(response => {
      res.json(response);
    }).then(data => res.json(data))
    .catch(e => {
      res.status(400);
    });
});

app.listen(process.env.PORT, () => {
  process.stdout.write(`\n\napp listening on port ${process.env.PORT}\n\n`);
});
