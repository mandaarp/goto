'use strict';

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const appConfig = require('./config/app.config');
const urlModel = require('./models/url.model');

const app = express();
app.use(express.static('public'));
app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use('/', require(`./routes`));

urlModel.URLModel.sync();

const server = app.listen(appConfig.port, () => {
    console.log(`Server is listening on port ${appConfig.port}`);
});

module.exports = server;
