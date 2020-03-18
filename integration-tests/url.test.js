'use strict';

const puppeteer = require('puppeteer');
const Chai = require('chai');
const childProcess = require('child_process');
const urlModel = require(`../models/url.model`).URLModel;

Chai.use(require('chai-http'));

describe('URL', () => {
    let browser = null;
    let page = null;
    let serverInstance = null;
    const port = 3010;
    const gotoURL = `http://localhost:${port}`;
    const sampleData = [{
        name: 'g',
        url: 'https://www.google.com'
    }, {
        name: 'y',
        url: 'https://www.yahoo.com'
    }];
    let startServer = async () => {
        serverInstance = childProcess.spawn('node', ['server.js'], {detached: true});
    };
    let stopServer = async () => {
        process.kill(serverInstance.pid);
    };
    let sleep = async ms => new Promise(resolve => setTimeout(resolve, ms));
    let retry = async (promiseFactory, retryCount) => {
        try {
            return await promiseFactory();
        } catch (error) {
            if (retryCount <= 0) {
                throw error;
            }
            console.log(`retrying ${retryCount} ...`);
            await sleep(1000);
            return await retry(promiseFactory, retryCount - 1);
        }
    };
    const typeInput = async (selector, text) => {
        const input = await page.$(selector);
        await input.click({clickCount: 3});
        await input.type(text);
    };

    before(async () => {
        await startServer();
        browser = await puppeteer.launch({
            headless: true
        });
        page = await browser.newPage();
        page.emulate({
            viewport: {
                width: 800,
                height: 600
            },
            userAgent: ''
        });
        await retry(() => page.goto(gotoURL), 10);
    });

    after(async () => {
        await browser.close();
        await stopServer();
    });

    beforeEach(async () => {
        await urlModel.sync({force: true});
    });

    afterEach(async () => {
        await urlModel.drop();
    });

    it('should create a new entry', async () => {
        const expectedData = sampleData[0];
        await typeInput('#name-text', expectedData.name);
        await typeInput('#url-text', expectedData.url);
        await page.click(`#create-url-button`);
        const allURLs = await Chai.request(gotoURL).get('/api/url');
        const found = allURLs.body.data.find(e => e.name === expectedData.name);
        Chai.expect(found).to.be.not.null;
        Chai.expect(found.name).to.be.equal(expectedData.name);
        Chai.expect(found.url).to.be.equal(expectedData.url);
    });

    it('should fetch all entries', async () => {
        for(let index = 0; index < sampleData.length; ++index) {
            await typeInput('#name-text', sampleData[index].name);
            await typeInput('#url-text', sampleData[index].url);
            await page.click(`#create-url-button`);
            await sleep(100);
        }
        await page.click(`#refresh-url-table-button`);
        for(let index = 0; index < sampleData.length; ++index) {
            await page.waitForSelector(`#urls-table-row-${index}-cell-name-text-name`, {});
            let actual = await page.$eval(`#urls-table-row-${index}-cell-name-text-name`, e => e.textContent);
            Chai.expect(actual.trim()).to.be.equal(sampleData[index].name);
            actual = await page.$eval(`#urls-table-row-${index}-cell-url-text-url`, e => e.textContent);
            Chai.expect(actual.trim()).to.be.equal(sampleData[index].url);
            actual = await page.$eval(`#urls-table-row-${index}-cell-hits-text-hits`, e => e.textContent);
            Chai.expect(actual).to.be.not.null;
            actual = await page.$eval(`#urls-table-row-${index}-cell-createdAt-text-createdAt`, e => e.textContent);
            Chai.expect(actual).to.be.not.null;
            actual = await page.$eval(`#urls-table-row-${index}-cell-updatedAt-text-updatedAt`, e => e.textContent);
            Chai.expect(actual).to.be.not.null;
        }
    });

    it('should redirect to specified URL from name', async () => {
        await typeInput('#name-text', sampleData[0].name);
        await typeInput('#url-text', sampleData[0].url);
        await page.click(`#create-url-button`);
        await sleep(100);
        await page.goto(`${gotoURL}/${sampleData[0].name}`);
        await page.waitForSelector(`#hplogo`);
        const actual = await page.$eval(`#hplogo`, e => e.alt);
        Chai.expect(actual.toLowerCase()).to.be.equal('google');
    });
});
