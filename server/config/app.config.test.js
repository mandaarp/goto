'use strict';

const Fs = require('fs');
const Ini = require('ini');
const Chai = require('chai');

const appConfig = require(`${__dirname}/app.config`);
const ENV_PATH = appConfig.getEnvPath();

Chai.should();

let parse_env = () => {
    return Ini.parse(Fs.readFileSync(ENV_PATH, 'utf-8'));
};

describe('App Config ', () => {
    before(done => {
        done();
    });
    after(done => {
        // Nothing to clean up
        done();
    });
    beforeEach(done => {
        // Nothing to set up
        done();
    });
    afterEach(done => {
        // Nothing to clean up
        done();
    });

    it('should load environment file', done => {
        appConfig.should.have.property('port');

        done();
    });

    it('should have correct configuration values', done => {
        const expected_output = parse_env();
        Chai.expect(appConfig.dbPath).to.equal(expected_output['DB_PATH']);
        Chai.expect(appConfig.port).to.equal(expected_output['PORT']);
        done();
    });
});
