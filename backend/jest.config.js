module.exports = {
  testEnvironment: "node",
  testMatch: ["<rootDir>/tests/**/*.test.js"],
  setupFilesAfterEnv: ["<rootDir>/tests/setup.js"],
  // mongodb-memory-server downloads a Mongo binary on first run; 30s gives
  // the cold-start path enough headroom on CI without masking real hangs.
  testTimeout: 30000,
};
