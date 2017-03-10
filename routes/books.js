'use strict';

const express = require('express');
const router = express.Router();
const knex = require('../knex.js');
const humps = require('humps');

// eslint-disable-next-line new-cap

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

router.get('/books/:id', (req, res) => {
    knex('books')
        .where('id', req.params.id)
        .first()
        .then((book) => {
            if (!book) {
                return next();
            }
            res.send(humps.camelizeKeys(book));
        })
        .catch((err) => {
            res.sendStatus(500);
        });
});

router.post('/books', (req, res) => {
    knex('books')
        .insert({
            title: req.body.title,
            author: req.body.author,
            genre: req.body.genre,
            description: req.body.description,
            cover_url: req.body.coverUrl
        }, '*')
        .then((items) => {
            res.send(humps.camelizeKeys(items[0]));
        })
        .catch((err) => {
            res.sendStatus(500);
        });
});

router.patch('/books/:id', (req, res) => {
    knex('books')
        .where('id', req.params.id)
        .first()
        .then((book) => {
            if (!book) {
                return next();
            }

            return knex('books')
                .update({
                    title: req.body.title,
                    author: req.body.author,
                    genre: req.body.genre,
                    description: req.body.description,
                    cover_url: req.body.coverUrl
                }, '*')
                .where('id', req.params.id);
        })
        .then((items) => {
            res.send(humps.camelizeKeys(items[0]));
        })
        .catch((err) => {
            res.sendStatus(500);
        });
})

router.delete('/books/:id', (req, res) => {
    let book;

    knex('books')
        .where('id', req.params.id)
        .first()
        .then((row) => {
            if (!row) {
                return next();
            }

            book = row;

            return knex('books')
                .del()
                .where('id', req.params.id);
        })
        .then(() => {
            delete book.id;
            res.send(humps.camelizeKeys(book));
        })
        .catch((err) => {
            res.sendStatus(500);
        });
})

module.exports = router;
