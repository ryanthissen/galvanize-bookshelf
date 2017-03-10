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
      // console.log(user);
      // if (!user) {
      //   return next();
      // } else {
      let password = user.hashed_password;
      bcrypt.compare(req.body.password, password)
        .then((user) => {
          console.log('fuck this shit');
          res.send(humps.camelizeKeys(user));
        })
    })
    .catch((err) => {
      res.set('Content-Type', 'match/plain')
      res.status(400).send('Bad email or password');
    });
  // .catch(bcrypt.MISMATCH_ERROR, )
});

router.delete('/token', (req, res) => {
  const token = '';
  res.cookie('token', token);
  res.end();
})

// router.post('/token', (req, res) => {
//   // let userEmail = req.body.email;
//   // let userPW = bcrypt.hash(req.body.password, 12);
//   // let userID = req.body.id;
//   knex('users')
//     .where('email', req.body.email)
//     .first()
//     .then((user) => {
//       if (!user) {
//         return next();
//       } else {
//         bcrypt.compare(req.body.password, user.hashed_password)
//       }
//     });
//     // .then((user) => {
//     //   if (user.email === userEmail && user.hashed_password === userPW) {
//     //     const claim = {
//     //       userId: user.id
//     //     };
//     //     const token = jwt.sign(claim, process.env.JWT_KEY, { //use this environment variable to sign the cookie
//     //       expiresIn: '7 days' // Adds an exp field to the payload
//     //     });
//     //     res.cookie('token', token, {
//     //       httpOnly: true,
//     //       expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days
//     //       secure: router.get('env') === 'production' // Set from the NODE_ENV
//     //     })
//     //     res.status(200).send(token);
//     //   }
//     // })
//     .catch((err) = {
//       res.sendStatus(400);
//     });
// });

module.exports = router;


// Routes
//
// In the routes/token.js module, add middleware to handle the following HTTP requests and send back the associated HTTP response. The information in both the request body and response body use the application/json content type.
//
// Request Method	Request URL	Request Body	Response Status	Response Body	Set-Cookie
// GET	/token	N/A	200	false	N/A
// POST	/token	{ "email": "jkrowling@gmail.com", "password": "youreawizard" }	200	{ id: 1, "email": "jkrowling@gmail.com", ... }	token=eyJhbG...
// GET	/token	N/A	200	true	N/A
// DELETE	/token	N/A	200	true	token=
// NOTE: The second GET /token request assumes a token was created by the previous POST /token request. Also, don't send the user's password or hashed password in the response body.
//
// Additionally, ensure the POST /token middleware handles the following HTTP requests and sends back the associated HTTP response. The information in the request body uses the application/json content type while the information in the response body uses the text/plain content type.
//
// Request Method	Request URL	Request Body	Response Status	Response Body
// POST	/token	{ "email": "bad.email@gmail.com", "password": "youreawizard" }	400	Bad email or password
// POST	/token	{ "email": "jkrowling@gmail.com", "password": "badpassword" }	400	Bad email or password
// You can run the following test suite to verify the middleware works as expected.
//
// NOTE The token is assumed to be stored in a cookie called token.
//
// npm test test/part4.routes.token.test.js
// d email or password
// You can run the following test suite to verify the middleware works as expected.
//
// NOTE The token is assumed to be stored in a cookie called token.
//
// npm test test/part4.routes.token.test.js
// token.test.js d email or password
// You can run the following test suite to verify the middleware works as expected.
//
// NOTE The token is assumed to be stored in a cookie called token.
//
// npm test test/part4.routes.token.test.js
