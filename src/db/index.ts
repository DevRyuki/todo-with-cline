/**
 * データベース操作の中央モジュール
 * 
 * このファイルは、アプリケーション全体でのデータベース操作のためのエントリーポイントです。
 * DB接続、クエリ実行、マイグレーションなどの機能を提供します。
 */

import { isTest } from './config';
import { createMockDb, setupMockDb } from './mock-utils';

// テスト環境の場合はモックDBを使用
// 実際のテスト環境では、各テストファイルでモックを設定する
const mockDb = createMockDb();
if (isTest) {
  console.log('テスト環境用のモックDBを初期化しました');
}
setupMockDb(mockDb);

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

// テスト用のモックDBをエクスポート
export { mockDb };

// テスト用のクライアント関連の機能をエクスポート
export {
  createTestPool,
  createTestDb,
  setupTestDb,
  cleanupTestDb,
  testDbConfig,
} from './test-client';

// モックユーティリティをエクスポート
export {
  createMockDb,
  setupMockDb,
} from './mock-utils';
