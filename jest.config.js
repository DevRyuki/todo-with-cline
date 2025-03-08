/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

/** @type {import('jest').Config} */
const config = {
  // ESMプロジェクト用の設定
  preset: 'ts-jest/presets/js-with-ts-esm',
  testEnvironment: 'node',
  
  // パスエイリアスの設定
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  
  // TypeScriptファイルの変換設定
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      useESM: true,
    }],
  },
  
  // ESMとして扱うファイル拡張子
  extensionsToTreatAsEsm: ['.ts'],
  
  // モジュールファイル拡張子
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  
  // テストファイルのパターン
  testMatch: ['**/__tests__/**/*.test.ts'],
  
  // グローバル設定
  globals: {
    'ts-jest': {
      useESM: true,
    },
  },
  
  // モックの自動クリア
  clearMocks: true,
  
  // カバレッジプロバイダー
  coverageProvider: "v8",
};

export default config;
