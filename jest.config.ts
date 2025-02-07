export default {
  testEnvironment: "jest-environment-jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts", "<rootDir>/test/__mocks__/globalMock.ts"],
  moduleNameMapper: {
    "\\.(gif|ttf|eot|svg|svg|png)$": "<rootDir>/test/__mocks__/fileMock.js",
    "\\.svg\\?react$": "<rootDir>/test/__mocks__/fileMock.js",
    "\\.(css|less|sass|scss)$": "identity-obj-proxy",
    "^uuid$": "uuid"
  }
};
