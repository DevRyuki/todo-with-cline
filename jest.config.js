/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: 'tsconfig.json',
      isolatedModules: true,
      typeCheck: false, // 型チェックをスキップ
    }],
  },
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.cjs'],
  testPathIgnorePatterns: ['/node_modules/', '/.next/'],
};
