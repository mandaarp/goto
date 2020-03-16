'use strict';

const Router = require('express').Router();
const URLRoute = require('./url.route');

Router.route('/url')
    .get(URLRoute.getAllURLs)
    .post(URLRoute.createNewURL);

Router.route('/url/:name')
    .get(URLRoute.getURLByName)
    .delete(URLRoute.deleteURL);

module.exports = {
    Router
};
