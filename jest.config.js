/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    // CSSモジュールのモック
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: 'tsconfig.json',
      isolatedModules: true,
      typeCheck: false, // 型チェックをスキップ
      useESM: true, // ESモジュールサポート
    }],
  },
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.cjs'],
  testPathIgnorePatterns: ['/node_modules/', '/.next/'],
  // Next.js環境のモック
  setupFiles: ['<rootDir>/jest.setup.js'],
  // テスト実行環境の分離
  projects: [
    {
      displayName: 'components',
      testMatch: ['<rootDir>/src/features/**/components/**/*.test.{ts,tsx}'],
    },
    {
      displayName: 'hooks',
      testMatch: ['<rootDir>/src/features/**/hooks/**/*.test.{ts,tsx}'],
    },
    {
      displayName: 'services',
      testMatch: ['<rootDir>/src/features/**/services/**/*.test.{ts,tsx}'],
    },
    {
      displayName: 'handlers',
      testMatch: ['<rootDir>/src/features/**/handlers/**/*.test.{ts,tsx}'],
    },
  ],
};
