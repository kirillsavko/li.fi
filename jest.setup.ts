import "@testing-library/jest-dom";
// Resets all mocks after each test, so every test has the correct state
afterEach(() => {
  jest.restoreAllMocks()
  jest.clearAllMocks()
  jest.resetModules()
});
