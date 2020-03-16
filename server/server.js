'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const appConfig = require('./config/app.config');
const apiRoutes = require('./routes').Router;

const app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use('/api', apiRoutes);

const server = app.listen(appConfig.port, () => {
    console.log(`Server is listening on port ${appConfig.port}`);
});

module.exports = server;
