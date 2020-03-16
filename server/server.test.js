'use strict';

const Chai = require('chai');
const ChaiHTTP = require('chai-http');

const urlModel = require('./models/url.model');
const server = require(`./server`);

Chai.use(ChaiHTTP);
const expect = Chai.expect;

describe('API routes', () => {
    const data = {
        name: 'google',
        url: 'http://google.com'
    };
    before(async () => {
        await urlModel.URLModel.sync({force: true});
        for (let index = 0; index < 10; ++index) {
            await urlModel.createOneByNameAndURL(`${data.name}${index}`, data.url);
        }
    });
    after(async () => {
        await server.close();
        await urlModel.URLModel.drop();
    });
    beforeEach(async () => {});
    afterEach(async () => {});

    it('should GET all URLs on /api/url', async () => {
        const response = await Chai.request(server).get('/api/url');
        expect(response.type).to.equal('application/json');
        expect(response.status).to.equal(200);
        expect(response.body.status).to.equal('success');
        expect(response.body.data).to.be.of.length(10);
    });
    it('should GET a specific URL on /api/url/:name', async () => {
        const response = await Chai.request(server).get(`/api/url/${data.name}4`);
        expect(response.type).to.equal('application/json');
        expect(response.status).to.equal(200);
        expect(response.body.status).to.equal('success');
        expect(response.body.data.name).to.equal(`${data.name}4`);
    });
    it('should GET a specific URL on /api/url/:name and hit count should increase by 1', async () => {
        let response = await Chai.request(server).get(`/api/url/${data.name}4`);
        const hitCount = response.body.data.hits;
        response = await Chai.request(server).get(`/api/url/${data.name}4`);
        expect(response.type).to.equal('application/json');
        expect(response.status).to.equal(200);
        expect(response.body.status).to.equal('success');
        expect(response.body.data.name).to.equal(`${data.name}4`);
        expect(response.body.data.hits).to.equal(hitCount+1);
    });
    it('should POST a new URL on /api/url/', async () => {
        let response = await Chai.request(server)
            .post(`/api/url/`)
            .send(data);
        expect(response.type).to.equal('application/json');
        expect(response.status).to.equal(200);
        expect(response.body.status).to.equal('success');
        expect(response.body.data.name).to.be.equal(data.name);
        expect(response.body.data.url).to.be.equal(data.url);

        response = await Chai.request(server).get(`/api/url/${data.name}`);
        expect(response.type).to.equal('application/json');
        expect(response.status).to.equal(200);
        expect(response.body.status).to.equal('success');
        expect(response.body.data.name).to.be.equal(data.name);
        expect(response.body.data.url).to.be.equal(data.url);
    });
    it('should DELETE an existing URL on /api/url/:name', async () => {
        let response = await Chai.request(server)
            .delete(`/api/url/${data.name}3`);
        expect(response.type).to.equal('application/json');
        expect(response.status).to.equal(200);
        expect(response.body.status).to.equal('success');
        expect(response.body.data.deletedCount).to.be.equal(1);

        response = await Chai.request(server).get(`/api/url/${data.name}3`);
        expect(response.type).to.equal('application/json');
        expect(response.status).to.equal(500);
        expect(response.body.status).to.equal('error');
    });
});
