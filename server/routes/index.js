'use strict';

const Router = require('express').Router();

Router.use('/', require(`./root.route`));
Router.use('/api', require(`./url.route`));

module.exports = Router;
