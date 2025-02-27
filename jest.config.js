module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  globalTeardown: '<rootDir>/tests/teardown.ts',
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.tests.json'
    }
  }
};
