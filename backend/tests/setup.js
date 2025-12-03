// Setup file for Jest tests
// This runs before all tests

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.PORT = 5001;
process.env.FRONTEND_URL = 'http://localhost:3000';

// Suppress console logs during tests (optional)
// global.console = {
//   ...console,
//   log: jest.fn(),
//   debug: jest.fn(),
//   info: jest.fn(),
//   warn: jest.fn(),
// };

// Increase Jest timeout
jest.setTimeout(30000);