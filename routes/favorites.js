'use strict';

const express = require('express');
const router = express.Router();
const knex = require('../knex.js');
const humps = require('humps');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt-as-promised');

// YOUR CODE HERE


router.get('/favorites/check', (req, res) => {
  jwt.verify(req.cookies.token, process.env.JWT_KEY, (err, payload) => {
    if (err) {
      res.set('Content-Type', 'match/plain');
      res.status(401).send('Unauthorized');
    } else {
      knex('favorites')
        .where('book_id', req.query.bookId)
        .first()
        .then((favorite) => {
          if (!favorite) {
            res.set('Content-Type', 'match/json');
            res.status(200).send('false');
          } else {
            res.set('Content-Type', 'match/json');
            res.status(200).send('true');
          }
        })
        .catch((err) => {
          res.sendStatus(500);
        });
    }
  });
});

router.get('/favorites', (req, res) => {
  jwt.verify(req.cookies.token, process.env.JWT_KEY, (err, payload) => {
    if (err) {
      res.set('Content-Type', 'match/plain');
      res.status(401).send('Unauthorized');
    } else {
      knex.from('favorites').innerJoin('books', 'favorites.book_id', 'books.id')
        .then((favorites) => {
          res.send(humps.camelizeKeys(favorites));
        })
    }
  })
});

router.post('/favorites', (req, res) => {
  jwt.verify(req.cookies.token, process.env.JWT_KEY, (err, payload) => {
    if (err) {
      res.set('Content-Type', 'match/plain');
      res.status(401).send('Unauthorized');
    } else {
      knex('favorites')
        .insert({
          book_id: req.body.bookId,
          user_id: payload.userId
        }, '*')
        .then((favorites) => {
          const favorite = favorites[0];
          delete favorite.created_at;
          delete favorite.updated_at;
          res.send(humps.camelizeKeys(favorite));
        });
    }
  });
});

router.delete('/favorites', (req, res) => {
  let book;
  jwt.verify(req.cookies.token, process.env.JWT_KEY, (err, payload) => {
    if (err) {
      res.set('Content-Type', 'match/plain');
      res.status(401).send('Unauthorized');
    } else {
      knex('favorites')
        .where('book_id', req.body.bookId)
        .first()
        .then((row) => {
          if (!row) {
            return next();
          }

          book = row;

          return knex('favorites')
            .del()
            .where('book_id', req.body.bookId)
        })
        .then(() => {
          delete book.id,
            delete book.created_at,
            delete book.updated_at,
            res.send(humps.camelizeKeys(book));
        })
    }
  })
})

module.exports = router;
