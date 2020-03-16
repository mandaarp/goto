'use strict';
const appConfig = require('../config/app.config');
const Sequelize = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: appConfig.dbPath
});

module.exports = {
    sequelize
};
