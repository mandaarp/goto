const puppeteer = require('puppeteer');
const path = require('path');

describe('App initialization ...', () => {
    let browser = null;
    let page = null;
    beforeAll(async () => {
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
        const indexFile = path.join(__dirname, '..', 'build', 'index.html');
        await page.goto(`file:///${indexFile}`);
    });
    afterAll(async () => {
        browser.close();
    });

    it('should display homepage', async () => {
        const html = await page.$('#root', e => e);
        expect(html).toBeTruthy();
    });
    it('should display alerts div', async () => {
        const html = await page.$('#alerts-div', e => e);
        expect(html).toBeTruthy();
    });
    it('should display name textbox', async () => {
        const html = await page.$('#name-text', e => e);
        expect(html).toBeTruthy();
    });
    it('should display url textbox', async () => {
        const html = await page.$('#url-text', e => e);
        expect(html).toBeTruthy();
    });
    it('should display create url button', async () => {
        const html = await page.$('#create-url-button', e => e);
        expect(html).toBeTruthy();
    });
    it('should display refresh url table button', async () => {
        const html = await page.$('#refresh-url-table-button', e => e);
        expect(html).toBeTruthy();
    });
    it('should display name column in url table', async () => {
        const html = await page.$('#urls-table-head-name', e => e);
        expect(html).toBeTruthy();
    });
    it('should display url column in url table', async () => {
        const html = await page.$('#urls-table-head-url', e => e);
        expect(html).toBeTruthy();
    });
    it('should display created-at column in url table', async () => {
        const html = await page.$('#urls-table-head-createdAt', e => e);
        expect(html).toBeTruthy();
    });
    it('should display updated-at column in url table', async () => {
        const html = await page.$('#urls-table-head-updatedAt', e => e);
        expect(html).toBeTruthy();
    });
    it('should display hits column in url table', async () => {
        const html = await page.$('#urls-table-head-hits', e => e);
        expect(html).toBeTruthy();
    });
});

