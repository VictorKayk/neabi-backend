module.exports = {
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '!<rootDir>/src/main/**',
    '!<rootDir>/src/**/index.ts',
  ],
  coverageDirectory: 'coverage',
  coverageProvider: 'babel',
  moduleNameMapper: {
    '@/test/(.+)': '<rootDir>/test/$1',
    '@/(.+)': '<rootDir>/src/$1',
  },
  testMatch: ['**/*.spec.ts', '**/*.test.ts'],
  roots: ['<rootDir>/src', '<rootDir>/test'],
  transform: {
    '\\.ts$': 'ts-jest',
  },
  clearMocks: true,
};
