/**
 * テスト用のDBクライアント
 * 
 * このモジュールは、テスト環境でのデータベース操作をサポートするための
 * クライアント関数を提供します。
 */

import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { dbConfig, isTest } from './config';
import schema from './schema';

/**
 * テスト用のデータベース設定
 */
export const testDbConfig = {
  ...dbConfig,
  database: `${dbConfig.database}_test`,
  // テスト環境ではSSLを無効化
  ssl: false,
};

/**
 * テスト用のプールを作成
 * @returns PostgreSQLプールインスタンス
 */
export const createTestPool = () => {
  if (!isTest) {
    console.warn('警告: テスト環境以外でテスト用プールを作成しています');
  }
  
  return new Pool(testDbConfig);
};

/**
 * テスト用のDrizzle ORMインスタンスを作成
 * @param pool PostgreSQLプール
 * @returns Drizzle ORMインスタンス
 */
export const createTestDb = (pool = createTestPool()) => {
  return drizzle(pool, { schema });
};

/**
 * テスト用のデータベースをセットアップ
 * 統合テストで使用するための実際のデータベース接続
 */
export const setupTestDb = async () => {
  const pool = createTestPool();
  
  try {
    // テスト用データベースが存在するか確認
    const dbExistsResult = await pool.query(`
      SELECT 1 FROM pg_database WHERE datname = '${testDbConfig.database}'
    `);
    
    // テスト用データベースが存在しない場合は作成
    if (dbExistsResult.rowCount === 0) {
      // デフォルトのpostgresデータベースに接続
      const rootPool = new Pool({
        ...testDbConfig,
        database: 'postgres',
      });
      
      try {
        // 他の接続を切断
        await rootPool.query(`
          SELECT pg_terminate_backend(pg_stat_activity.pid)
          FROM pg_stat_activity
          WHERE pg_stat_activity.datname = '${testDbConfig.database}'
          AND pid <> pg_backend_pid()
        `);
        
        // データベースを作成
        await rootPool.query(`CREATE DATABASE ${testDbConfig.database}`);
      } finally {
        await rootPool.end();
      }
    }
    
    // テスト用データベースに接続
    const testDb = createTestDb(pool);
    
    // スキーマをリセット
    await pool.query('DROP SCHEMA IF EXISTS public CASCADE');
    await pool.query('CREATE SCHEMA public');
    
    // マイグレーションを実行
    // 必要に応じてマイグレーションを実行するコードをここに追加
    
    return { pool, db: testDb };
  } catch (error) {
    await pool.end();
    throw error;
  }
};

/**
 * テスト用のデータベースをクリーンアップ
 * @param pool PostgreSQLプール
 */
export const cleanupTestDb = async (pool: Pool) => {
  try {
    // スキーマをリセット
    await pool.query('DROP SCHEMA IF EXISTS public CASCADE');
    await pool.query('CREATE SCHEMA public');
  } finally {
    await pool.end();
  }
};
