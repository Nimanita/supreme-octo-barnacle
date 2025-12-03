module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js'],
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/server.js',
    '!src/config/**'
  ],
  testTimeout: 30000,
  forceExit: true,
  detectOpenHandles: true,
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js']
};