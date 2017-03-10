'use strict';

const express = require('express');

// eslint-disable-next-line new-cap
const router = express.Router();
const bcrypt = require('bcrypt-as-promised');
const knex = require('../knex.js');
const humps = require('humps');

// YOUR CODE HERE

router.post('/users', (req, res, next) => {
  bcrypt.hash(req.body.password, 12)
    .then((hashed_password) => {
      return knex('users')
        .insert({
          first_name: req.body.firstName,
          last_name: req.body.lastName,
          email: req.body.email,
          hashed_password: hashed_password
        }, '*')
    })
    .then((users) => {
      const user = users[0];
      delete user.hashed_password;
      delete user.created_at;
      delete user.updated_at;
      // console.log(user);
      res.send(humps.camelizeKeys(user));
    })
    .catch((err) => {
      res.sendStatus(500);
    });
});

module.exports = router;
