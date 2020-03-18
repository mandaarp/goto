const puppeteer = require('puppeteer');
const Chai = require('chai');
const childProcess = require('child_process');


describe('Homepage', () => {
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

    it('should display homepage', async () => {
        const html = await page.$('#root', e => e);
        Chai.expect(html).to.be.not.null;
    });
    it('should display alerts div', async () => {
        const html = await page.$('#alerts-div', e => e);
        Chai.expect(html).to.be.not.null;
    });
    it('should display name textbox', async () => {
        const html = await page.$('#name-text', e => e);
        Chai.expect(html).to.be.not.null;
    });
    it('should display url textbox', async () => {
        const html = await page.$('#url-text', e => e);
        Chai.expect(html).to.be.not.null;
    });
    it('should display create url button', async () => {
        const html = await page.$('#create-url-button', e => e);
        Chai.expect(html).to.be.not.null;
    });
    it('should display refresh url table button', async () => {
        const html = await page.$('#refresh-url-table-button', e => e);
        Chai.expect(html).to.be.not.null;
    });
    it('should display name column in url table', async () => {
        const html = await page.$('#urls-table-head-name', e => e);
        Chai.expect(html).to.be.not.null;
    });
    it('should display url column in url table', async () => {
        const html = await page.$('#urls-table-head-url', e => e);
        Chai.expect(html).to.be.not.null;
    });
    it('should display created-at column in url table', async () => {
        const html = await page.$('#urls-table-head-createdAt', e => e);
        Chai.expect(html).to.be.not.null;
    });
    it('should display updated-at column in url table', async () => {
        const html = await page.$('#urls-table-head-updatedAt', e => e);
        Chai.expect(html).to.be.not.null;
    });
    it('should display hits column in url table', async () => {
        const html = await page.$('#urls-table-head-hits', e => e);
        Chai.expect(html).to.be.not.null;
    });
    it('should display actions column in url table', async () => {
        const html = await page.$('#urls-table-head-actions', e => e);
        Chai.expect(html).to.be.not.null;
    });
});
