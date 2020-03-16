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
            is: /^\S*$/
        }
    },
    url: {
        type: Sequelize.STRING,
        validate: {
            isUrl: true,
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
        await foundURL.increment('hits', {by: 1});
        foundURL = foundURL.dataValues;
    } catch (err) {
        console.log(err);
    }
    return foundURL;
};
const createOne = async (name, url) => {
  let createdURL = null;
  try {
      createdURL = await URL.create({name, url});
      createdURL = createdURL.dataValues;
  } catch (err) {
      console.log(err);
  }
  return createdURL;
};

const deleteOneByName = async name => {
    let deletedURLsCount = null;
    try {
        deletedURLsCount = await URL.destroy({where: {name}});
    } catch (err) {
        console.log(err);
    }
    return deletedURLsCount;
};
const findAllURLs = async () => {
    let allURLs = null;
    try {
        allURLs = await URL.findAll();
        allURLs = allURLs.map(url => url.dataValues);
    } catch (err) {
        console.log(err);
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
