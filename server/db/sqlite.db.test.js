'use strict';

const Chai = require('chai');
const sqliteDB = require('../db/sqlite.db');

Chai.should();

describe('SQLite DB ', async () => {
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

    it('should connect successfully', async () => {
        const sequelize = sqliteDB.sequelize;
        Chai.expect(async () => await sequelize.authenticate()).to.not.throw();
    });
});
