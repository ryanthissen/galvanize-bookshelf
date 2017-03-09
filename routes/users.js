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


// router.post('/books', (req, res) => {
//   knex('books')
//       .insert({
//           title: req.body.title,
//           author: req.body.author,
//           genre: req.body.genre,
//           description: req.body.description,
//           cover_url: req.body.coverUrl
//       }, '*')
//       .then((items) => {
//           res.send(humps.camelizeKeys(items[0]));
//       })
//       .catch((err) => {
//           res.sendStatus(500);
//       });
// });




// Routes
//
// In the routes/users.js module, add middleware to handle the following HTTP requests and send back the associated HTTP response. The information in both the request body and response body use the application/json content type.
//
// Request Method	Request URL	Request Body	Response Status	Response Body
// POST	/users	{ "first_name": "John", "last_name": "Siracusa", "email": "john.siracusa@gmail.com", "password": "ilikebigcats" }	200	`{ id: 2, "first_name": "John", "last_name": "Siracusa", ... }
// NOTE: Only store a cryptographic hash of the password in the database. And don't send the new user's password or hashed password in the response body.
//
// You can run the following test suite to verify the middleware works as expected.
