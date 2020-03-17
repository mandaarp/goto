module.exports = {
    preset: 'jest-puppeteer',
    testTimeout: 20000,
    collectCoverage: true,
    testPathIgnorePatterns: [
        '<rootDir>/node_modules',
        '<rootDir>/src'
    ]
};
