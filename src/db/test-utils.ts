/**
 * テスト用のデータベースユーティリティ
 * 
 * このモジュールは、テスト環境でのデータベース操作をサポートするためのユーティリティを提供します。
 * テスト用のモックDBクライアントや、テスト用のデータベース接続設定などが含まれています。
 */

import { jest } from '@jest/globals';
import { 
  createMockDb, 
  setupMockDb,
} from './mock-utils';
import {
  createTestPool,
  createTestDb,
  setupTestDb,
  cleanupTestDb,
  testDbConfig,
} from './test-client';

/**
 * テスト用のモックDBを作成
 * @param options モックの設定オプション
 * @returns 設定済みのモックDB
 */
export const createTestMockDb = (options: {
  selectResult?: unknown;
  insertResult?: unknown;
  updateResult?: unknown;
  deleteResult?: unknown;
} = {}) => {
  const mockDb = createMockDb();
  setupMockDb(mockDb, options);
  return mockDb;
};

/**
 * テスト用のモックDBをリセット
 * @param mockDb モックDB
 */
export const resetTestMockDb = (mockDb: ReturnType<typeof createMockDb>) => {
  jest.resetAllMocks();
  Object.values(mockDb).forEach(mock => mock.mockReset());
};

// 再エクスポート
export {
  createTestPool,
  createTestDb,
  setupTestDb,
  cleanupTestDb,
  testDbConfig,
};
