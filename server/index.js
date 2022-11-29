require('dotenv/config');
const path = require('path');
const express = require('express');
const errorMiddleware = require('./error-middleware');
const pg = require('pg');
const yelp = require('yelp-fusion');
const client = yelp.client(process.env.YELP_API_KEY);

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const app = express();
const publicPath = path.join(__dirname, 'public');

if (process.env.NODE_ENV === 'development') {
  app.use(require('./dev-middleware')(publicPath));
} else {
  app.use(express.static(publicPath));
}

app.use(express.json());

app.get('/api/hello', (req, res) => {
  res.json({ hello: 'world' });
});

app.get('/api/climbing', (req, res, next) => {
  client.search({
    term: 'boulder, climb, gym',
    latitude: 33.6349171,
    longitude: -117.7405465,
    radius: 30000
  })
    .then(response => {
      res.json(response.jsonBody.businesses);
    })
    .catch(err => next(err));
});

app.post('/api/climbing/user', (req, res) => {
  const user = req.body;
  if (user.name === undefined) {
    res.status(400).json({
      error: 'invalid entry... "name" is required'
    });

  } else if (user.username === undefined) {
    res.status(400).json({
      error: 'invalid entry... "username" is required'
    });

  } else if (user.password === undefined) {
    res.status(400).json({
      error: 'invalid entry... "password" is required'
    });

  } else {
    const userEntry = [user.name, user.username, user.password];
    const sql = `insert into "users" ("name", "userName", "hashedPassword", "joinedAt")
               values ($1, $2, $3, now())
               returning *`;
    db.query(sql, userEntry)
      .then(result => {
        res.status(201).json(result.rows[0]);
      }
      )
      .catch(err => {
        console.error(err);
        res.status(500).json({
          error: 'An unexpected error occured'
        });
      });
  }
});

app.post('/api/climbing/gym', (req, res) => {
  const gym = req.body;
  if (gym.name === undefined) {
    res.status(400).json({
      error: 'invalid entry... "name" is required'
    });

  } else if (gym.lat === undefined) {
    res.status(400).json({
      error: 'invalid entry... "lat" is required'
    });

  } else if (gym.lng === undefined) {
    res.status(400).json({
      error: 'invalid entry... "lng" is required'
    });

  } else if (gym.rating <= 0 || gym.rating > 5) {
    res.status(400).json({
      error: 'rating must be between 1 and 5'
    });

  } else {
    const gymEntry = [gym.name, gym.lat, gym.lng, gym.rating];
    const sql = `insert into "gyms" ("name", "lat", "lng", "rating")
               values ($1, $2, $3, $4)
               returning *`;
    db.query(sql, gymEntry)
      .then(result => {
        res.status(201).json(result.rows[0]);
      }
      )
      .catch(err => {
        console.error(err);
        res.status(500).json({
          error: 'An unexpected error occured'
        });
      });
  }
});

app.post('/api/climbing/rating', (req, res) => {
  const rating = req.body;
  if (rating.rating === undefined) {
    res.status(400).json({
      error: 'invalid rating'
    });
  } else {
    const ratingEntry = [rating.userId, rating.gymId, rating.rating];
    const sql = `insert into "ratings" ("userId", "gymId", "rating")
                              values ($1, $2, $3)
                returning *`;
    db.query(sql, ratingEntry)
      .then(result => {
        res.status(201).json(result.rows[0]);
      });
  }
});

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  process.stdout.write(`\n\napp listening on port ${process.env.PORT}\n\n`);
});
