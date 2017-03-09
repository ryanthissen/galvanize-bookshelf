'use strict';

const express = require('express');
const router = express.Router();
const knex = require('../knex.js');
const humps = require('humps');

// YOUR CODE HERE

router.get('/books', (req, res) => {
  knex('books')
      .orderBy('title')
      .then((items) => {
          res.send(humps.camelizeKeys(items));
      })
      .catch((err) => {
          res.sendStatus(500);
      });
});

module.exports = router;
