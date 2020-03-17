'use strict';
const path = require('path');

const dotenvMap = {
    'production': path.resolve(path.join(__dirname, '..', 'production.env')),
    'test': path.resolve(path.join(__dirname, '..', 'test.env'))
};

const getEnvPath = () => {
    const devEnv = path.resolve(path.join(__dirname, '..', 'development.env'));
  if(process.env.NODE_ENV) {
      return dotenvMap[process.env.NODE_ENV.lower()] || devEnv;
  }
  return devEnv;
};

require('dotenv').config({
    path: getEnvPath()
});

module.exports = {
    port: process.env.PORT,
    dbPath: process.env.DB_PATH,
    getEnvPath
};
