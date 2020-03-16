'use strict';

const URLModel = require('../models/url.model');

const getAllURLs = async (req, res) => {
    const allURLs = await URLModel.findAllURLs();
    if (allURLs) {
        res.json({
            status: 'success',
            data: allURLs
        });
    } else {
        res.status(500);
        res.json({
            status: 'error',
            data: 'Failed to get all URLs.'
        });
    }
};

const getURLByName = async (req, res) => {
    const url = await URLModel.findOneByName(req.params.name);
    if (url) {
        res.json({
            status: 'success',
            data: url
        });
    } else {
        res.status(500);
        res.json({
            status: 'error',
            data: 'Failed to get the URL information',
            params: req.body
        });
    }
};

const createNewURL = async (req, res) => {
    const createdURL = await URLModel.createOneByNameAndURL(req.body.name, req.body.url);
    if (createdURL) {
        res.json({
            status: 'success',
            data: createdURL
        });
    } else {
        res.status(500);
        res.json({
            status: 'error',
            data: 'Failed to create the URL entry.',
            params: req.body
        });
    }
};

const deleteURL = async (req, res) => {
    const deletedCount = await URLModel.deleteOneByName(req.params.name);
    if (deletedCount) {
        res.json({
            status: 'success',
            data: {
                deletedCount
            }
        });
    } else {
        res.status(404);
        res.json({
            status: 'error',
            data: 'Failed to delete the URL entry.',
            params: req.body
        });
    }
};

module.exports = {
    getAllURLs,
    getURLByName,
    createNewURL,
    deleteURL
};
