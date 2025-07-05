import nextJest from 'next/jest.js'
import type { Config } from 'jest'

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: './',
})

// Add any custom config to be passed to Jest
const config: Config = {
  // Automatically clear mock calls, instances, contexts and results between every test
  clearMocks: true,

  // Automatically reset mock state before every test
  resetMocks: true,

  // Automatically restore mock state and implementation before every test
  restoreMocks: true,

  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: false,

  // The directory where Jest should output its coverage files
  coverageDirectory: 'coverage',

  // An array of regexp pattern strings used to skip coverage collection
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/.next/',
    '/coverage/',
    '/dist/',
    '/build/',
    '/public/',
    'jest.config.ts',
    'next.config.ts',
  ],

  // A list of reporter names that Jest uses when writing coverage reports
  coverageReporters: ['json', 'text', 'lcov', 'html'],

  // An object that configures minimum threshold enforcement for coverage results
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },

  // The test environment that will be used for testing
  testEnvironment: 'jsdom',

  // Setup files after environment setup
  setupFilesAfterEnv: ['<rootDir>/src/tests/setup.ts'],

  // A list of paths to directories that Jest should use to search for files in
  roots: ['<rootDir>/src'],

  // The glob patterns Jest uses to detect test files
  testMatch: [
    '**/__tests__/**/*.(ts|tsx|js|jsx)',
    '**/*.(test|spec).(ts|tsx|js|jsx)',
  ],

  // An array of regexp pattern strings that are matched against all test paths
  testPathIgnorePatterns: [
    '/node_modules/',
    '/.next/',
    '/coverage/',
    '/dist/',
    '/build/',
    '/public/',
  ],

  // Module file extensions for importing
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],

  // A map from regular expressions to module names that allow to stub out resources
  moduleNameMapper: {
    '^@/components/(.*)$': '<rootDir>/src/components/$1',
    '^@components/(.*)$': '<rootDir>/src/components/$1',
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@core/(.*)$': '<rootDir>/src/@core/$1',
    '^@layouts/(.*)$': '<rootDir>/src/@layouts/$1',
    '^@menu/(.*)$': '<rootDir>/src/@menu/$1',
    '^@configs/(.*)$': '<rootDir>/src/configs/$1',
    '^@auth/(.*)$': '<rootDir>/src/auth/$1',
    '^@pages/(.*)$': '<rootDir>/src/pages/$1',
    '^@hooks/(.*)$': '<rootDir>/src/hooks/$1',
    '^@services/(.*)$': '<rootDir>/src/services/$1',
    '^@types/(.*)$': '<rootDir>/src/types/$1',
    '^@utils/(.*)$': '<rootDir>/src/utils/$1',
    '^@assets/(.*)$': '<rootDir>/src/assets/$1',
    '^@libs/(.*)$': '<rootDir>/src/libs/$1',
    '^@hocs/(.*)$': '<rootDir>/src/hocs/$1',
    '^@managers/(.*)$': '<rootDir>/src/managers/$1',
    '^@data/(.*)$': '<rootDir>/src/data/$1',
    '^@context/(.*)$': '<rootDir>/src/context/$1',

    // Handle CSS imports (with CSS modules)
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',

    // Handle static assets
    '\\.(jpg|jpeg|png|gif|webp|avif|svg)$': '<rootDir>/src/tests/__mocks__/fileMock.ts',

    // Handle absolute imports
    '^src/(.*)$': '<rootDir>/src/$1',
  },

  // Transform files with ts-jest
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: 'tsconfig.json',
    }],
  },

  // Test timeout in milliseconds - strict timeout to prevent hanging
  testTimeout: 5000,

  // Verbose output showing individual test results
  verbose: true,

  // Use single worker to prevent conflicts
  maxWorkers: 1,

  // Prevent tests from printing messages through console
  silent: false,

  // A list of paths to directories that Jest should use to search for files in
  // when resolving modules
  moduleDirectories: ['node_modules', '<rootDir>/src'],

  // Global variables that are available in all test environments
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
    },
  },
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config)
