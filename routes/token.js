'use strict';

const express = require('express');
const router = express.Router();
const knex = require('../knex.js');
const humps = require('humps');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt-as-promised');


// YOUR CODE HERE



router.get('/token', (req, res) => {
  jwt.verify(req.cookies.token, process.env.JWT_KEY, (err, payload) => {
    if (err) {
      res.set('Content-Type', 'match/json');
      res.status(200).send('false');
    } else {
      res.set('Content-Type', 'match/json');
      res.status(200).send('true');
    }
  });
});

router.post('/token', (req, res) => {
  knex('users')
    .where('email', req.body.email)
    .first()
    .then((user) => {
      let password = user.hashed_password;
      bcrypt.compare(req.body.password, password)
        .then((result) => {
          const claim = {
            userId: user.id
          };

          const token = jwt.sign(claim, process.env.JWT_KEY, {
            expiresIn: '7 days'
          });
          res.cookie('token', token, {
            httpOnly: true,
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
            secure: router.get('env') === 'production'
          })

          res.set('Content-Type', 'application/json');
          delete user.hashed_password;
          delete user.created_at;
          delete user.updated_at;

          // res.status(200).send(user);
          res.status(200).send(humps.camelizeKeys(user));


        })

        .catch(bcrypt.MISMATCH_ERROR, () => {
          res.set('Content-Type', 'match/plain');
          res.status(400).send('Bad email or password');
        })
    })

    .catch((err) => {
      res.set('Content-Type', 'match/plain')
      res.status(400).send('Bad email or password');
    });
});

router.delete('/token', (req, res) => {
  const token = '';
  res.cookie('token', token).end();
})

module.exports = router;
