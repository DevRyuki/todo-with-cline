/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: 'tsconfig.json',
      isolatedModules: true,
    }],
  },
  globals: {
    'ts-jest': {
      isolatedModules: true,
    },
  },
  // テスト実行時に型チェックをスキップ
  // これにより、テストファイルの型エラーが表示されなくなります
  ts: {
    typeCheck: false,
  },
};
