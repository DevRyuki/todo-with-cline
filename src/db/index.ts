/**
 * データベース操作の中央モジュール
 * 
 * このファイルは、アプリケーション全体でのデータベース操作のためのエントリーポイントです。
 * DB接続、クエリ実行、マイグレーションなどの機能を提供します。
 */

import { isTest } from './config';

// テスト環境の場合はモックDBを使用
// 実際のテスト環境では、各テストファイルでモックを設定する
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let mockDb: Record<string, unknown> | null = null;

// テスト環境でのみモックを初期化
if (isTest) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const mockUtils = require('./mock-utils');
  mockDb = mockUtils.createMockDb();
  mockUtils.setupMockDb(mockDb);
  console.log('テスト環境用のモックDBを初期化しました');
}

// クライアント関連の機能をエクスポート
export {
  db,
  createDb,
  getPool,
  createPool,
  closePool,
  runMigrations,
  resetDatabase,
  listTables,
} from './client';

// スキーマ関連の機能をエクスポート
export {
  authSchema,
  featureSchema,
} from './schema';

// 設定関連の機能をエクスポート
export {
  dbConfig,
  isProduction,
  isTest,
  isDevelopment,
} from './config';

// テスト用のモックDBをエクスポート（テスト環境のみ）
export { mockDb };

// テスト用のクライアント関連の機能をエクスポート
export {
  createTestPool,
  createTestDb,
  setupTestDb,
  cleanupTestDb,
  testDbConfig,
} from './test-client';

// モックユーティリティをテスト環境でのみエクスポート
// 注: ESモジュールでは動的エクスポートができないため、
// テスト環境では直接mock-utilsをインポートして使用することを推奨
