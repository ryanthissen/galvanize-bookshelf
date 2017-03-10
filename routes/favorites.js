'use strict';

const express = require('express');
const router = express.Router();
const knex = require('../knex.js');
const humps = require('humps');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt-as-promised');

// YOUR CODE HERE

router.get('/favorites/check', (req, res) => {
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
});

// router.get('/favorites', (req, res) => {
//
// })

// router.get('/books/:id', (req, res) => {
//     knex('books')
//         .where('id', req.params.id)
//         .first()
//         .then((book) => {
//             if (!book) {
//                 return next();
//             }
//             res.send(humps.camelizeKeys(book));
//         })
//         .catch((err) => {
//             res.sendStatus(500);
//         });
// });
//
// router.post('/books', (req, res) => {
//     knex('books')
//         .insert({
//             title: req.body.title,
//             author: req.body.author,
//             genre: req.body.genre,
//             description: req.body.description,
//             cover_url: req.body.coverUrl
//         }, '*')
//         .then((items) => {
//             res.send(humps.camelizeKeys(items[0]));
//         })
//         .catch((err) => {
//             res.sendStatus(500);
//         });
// });

module.exports = router;
