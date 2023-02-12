/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  preset: 'ts-jest',
  maxWorkers: 1,
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./jest.setup.ts']
};
