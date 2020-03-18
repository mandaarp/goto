'use strict';

const puppeteer = require('puppeteer');
const forever = require('forever-monitor');
const Chai = require('chai');

Chai.use(require('chai-http'));

describe('URL', () => {
    let browser = null;
    let page = null;
    let serverInstance = null;
    const gotoURL = 'http://localhost:3010';
    const sampleData = [{
        name: 'g',
        url: 'https://www.google.com'
    }, {
        name: 'y',
        url: 'https://www.yahoo.com'
    }];
    let startServer = async () => {
        serverInstance = new (forever.Monitor)(`server.js`, {
            watch: false,
            silent: true,
            args: [],
            cwd: `${__dirname}/../`,
            env: {
                'NODE_ENV': 'test'
            },
            sourceDir: `${__dirname}/../`
        });
        serverInstance.on('start', info => {
            console.log(`Server started...`);
        });
        serverInstance.on('exit', function () {
            console.log('Server is stopped.');
        });
        return serverInstance.start();

    };
    let stopServer = async () => {
        await serverInstance.stop();
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
        browser.close();
        await stopServer();
    });

    it('should create a new entry', async () => {
        const expectedData = sampleData[0];
        await page.type(`#name-text`, expectedData.name);
        await page.type(`#url-text`, expectedData.url);
        await page.click(`#create-url-button`);
        const allURLs = await Chai.request(gotoURL).get('/api/url');
        const found = allURLs.body.data.find(e => e.name === expectedData.name);
        Chai.expect(found).to.be.not.null;
        Chai.expect(found.name).to.be.equal(expectedData.name);
        Chai.expect(found.url).to.be.equal(expectedData.url);
        await Chai.request(gotoURL).delete(`api/url/?${expectedData.name}`);
    });

    it('should fetch all entries', async () => {
        sampleData.forEach(async e => {
            await page.type(`#name-text`, e.name);
            await page.type(`#url-text`, e.url);
            await page.click(`#create-url-button`);
        });
        await page.click(`#refresh-url-table-button`);
        sampleData.forEach(async (e, i) => {
            let actual = await page.$(`#urls-table-row-${i}-name-text-name`);
            Chai.expect(actual).to.be.equal(e.name);
            actual = await page.$(`#urls-table-row-${i}-url-text-url`);
            Chai.expect(actual).to.be.equal(e.url);
            actual = await page.$(`#urls-table-row-${i}-hits-text-hits`);
            Chai.expect(actual).to.be.equal(0);
            actual = await page.$(`#urls-table-row-${i}-createdAt-text-createdAt`);
            Chai.expect(actual).to.be.not.null;
            actual = await page.$(`#urls-table-row-${i}-updatedAt-text-updatedAt`);
            Chai.expect(actual).to.be.not.null;
            await Chai.request(gotoURL).delete(`api/url/?${e.name}`);
        });
    });
});
