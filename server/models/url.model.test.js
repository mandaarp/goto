'use strict';

const Chai = require('chai');
const urlModel = require('../models/url.model');

Chai.should();

describe('URLModel ', async () => {
    const data = {
        name: 'google',
        url: 'http://google.com'
    };
    before(async () => {
    });
    after(async () => {
    });
    beforeEach(async () => {
        await urlModel.URLModel.sync({force: true});
    });
    afterEach(async () => {
        await urlModel.URLModel.drop();
    });

    it('should create a new entry', async () => {
        const createdURL = await urlModel.createOneByNameAndURL(data.name, data.url);
        Chai.expect(createdURL).to.be.not.null;
        Chai.expect(createdURL.name).to.be.equal(data.name);
        Chai.expect(createdURL.url).to.be.equal(data.url);
    });
    it('should find an existing entry', async () => {
        await urlModel.URLModel.create(data);
        const foundURL = await urlModel.URLModel.findOne(data);
        Chai.expect(foundURL).to.be.not.null;
        Chai.expect(foundURL).to.be.contain(data);
    });
    it('should find an existing entry and increment the hit by 1', async () => {
        await urlModel.URLModel.create(data);
        const foundURL = await urlModel.findOneByName(data.name);
        Chai.expect(foundURL).to.be.not.null;
        Chai.expect(foundURL).to.be.contain(data);
        const incrementedHitsURL = await urlModel.URLModel.findOne(data);
        Chai.expect(incrementedHitsURL).to.be.not.null;
        Chai.expect(incrementedHitsURL.hits).to.be.equal(foundURL.hits + 1);
    });
    it('should return null if duplicate entry found', async () => {
        await urlModel.createOneByNameAndURL(data.name, data.url);
        const createdURL = await urlModel.createOneByNameAndURL(data.name, data.url);
        Chai.expect(createdURL).to.be.null;
    });
    it('should delete an existing entry', async () => {
        await urlModel.createOneByNameAndURL(data.name, data.url);
        const deletedURLsCount = await urlModel.deleteOneByName(data.name);
        const foundURL = await urlModel.findOneByName(data.name);
        Chai.expect(deletedURLsCount).to.be.equal(1);
        Chai.expect(foundURL).to.be.null;
    });
    it('should return all available URLs', async () => {
        for (let index = 0; index < 10; ++index) {
            await urlModel.createOneByNameAndURL(`${data.name}${index}`, data.url);
        }
        const allURLs = await urlModel.findAllURLs();
        Chai.expect(allURLs).to.be.not.null;
        Chai.expect(allURLs).to.have.length(10);
    });
});
