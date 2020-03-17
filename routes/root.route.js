'use strict';

const Router = require('express').Router();
const URLModel = require('../models/url.model');

Router.get('/favicon.ico', (req, res) => res.status(204));
Router.get('/', (req, res) => {
    res.sendFile(`${__dirname}/../public/index.html`)
});
Router.get('/:name', async (req, res) => {
    if('favicon.ico' !== req.params.name) {
        const url = await URLModel.findOneByName(req.params.name);
        if (url) {
            res.redirect(url.url);
        } else {
            res.status(500);
            res.json({
                status: 'error',
                data: 'Failed to get the URL information',
                params: req.body
            });
        }
    } else {
        res.status(200);
    }
});

module.exports = Router;
