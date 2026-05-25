module.exports = {
  setupFilesAfterEnv: ["./jest.setup.js"],
  globalSetup: require.resolve("@databases/pg-test/jest/globalSetup"),
  globalTeardown: require.resolve("@databases/pg-test/jest/globalTeardown"),
};
