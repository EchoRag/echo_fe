import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^@/(.*)$': '<rootDir>/src/$1', // Adjust the alias based on your paths
    '\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/__mocks__/fileMock.ts',
  },
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: 'tsconfig.json',
      useESM: true,
      diagnostics: {
        ignoreCodes: [1343],
      },
      astTransformers: {
        before: [
          {
            path: 'node_modules/ts-jest-mock-import-meta',
            options: {
              metaObjectReplacement: {
                env: {
                  // Replicate as .env.local
                  VITE_API_PATH: 'http://localhost:3001',
                },
              },
            },
          },
        ],
      },
    }],
  },
  transformIgnorePatterns: [
    'node_modules/(?!(react-markdown|vfile|unist-util-stringify-position|unified|bail|is-plain-obj|trough|remark-parse|mdast-util-from-markdown|micromark-util-combine-extensions|micromark-util-chunked|micromark-util-character|micromark-util-encode|micromark-util-normalize-identifier|micromark-util-resolve-all|micromark-util-sanitize-uri|micromark-util-subtokenize|micromark-util-symbol|micromark-util-types|micromark|unist-util-is|unist-util-visit|unist-util-visit-parents|unist-util-position|unist-util-generated|unist-util-stringify-position|unist-builder|unist-util-remove-position)/)',
  ],
  testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  testEnvironmentOptions: {
    customExportConditions: ['node', 'node-addons'],
  },
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'cobertura']
};

export default config;