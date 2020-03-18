'use strict';

const Sequelize = require('sequelize');
const database = require('../db/sqlite.db').sequelize;

const URL = database.define('url', {
    //attributes
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
            is: /^\S+$/
        }
    },
    url: {
        type: Sequelize.STRING,
        validate: {
            is: /^\S+$/
        }
    },
    hits: {
        type: Sequelize.BIGINT,
        defaultValue: 0
    }
}, {});

const findOneByNameAndIncrementHits = async (name) => {
    let foundURL = null;
    try {
        foundURL = await URL.findOne({where: {name}});
        if (foundURL) {
            await foundURL.increment('hits');
            await foundURL.save();
            foundURL = foundURL.dataValues;
        }
    } catch (err) {
        console.error(err);
    }
    return foundURL;
};
const createOne = async (name, url) => {
  let createdURL = null;
  try {
      createdURL = await URL.create({name, url});
      createdURL = createdURL.dataValues;
  } catch (err) {
      console.error(err);
  }
  return createdURL;
};

const deleteOneByName = async name => {
    let deletedURLsCount = null;
    try {
        deletedURLsCount = await URL.destroy({where: {name}});
    } catch (err) {
        console.error(err);
    }
    return deletedURLsCount;
};
const findAllURLs = async () => {
    let allURLs = null;
    try {
        allURLs = await URL.findAll();
        allURLs = allURLs.map(url => url.dataValues);
    } catch (err) {
        console.error(err);
    }
    return allURLs;
};

module.exports = {
    URLModel: URL,
    findAllURLs,
    findOneByName: findOneByNameAndIncrementHits,
    createOneByNameAndURL: createOne,
    deleteOneByName
};
