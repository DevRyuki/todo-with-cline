import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import pkg from 'pg';
const { Pool } = pkg;

import { dbConfig, isTest, logDbConfig } from './config';
import schema from './schema';

/**
 * PostgreSQLプールの作成
 * @param config 接続設定（省略時はデフォルト設定を使用）
 * @returns PostgreSQLプールインスタンス
 */
export const createPool = (config = dbConfig) => {
  return new Pool({
    host: config.host,
    port: config.port,
    user: config.user,
    password: config.password,
    database: config.database,
    ssl: config.ssl,
  });
};

// デフォルトのプールインスタンス
let _pool: pkg.Pool | null = null;

/**
 * デフォルトのプールインスタンスを取得
 * @returns PostgreSQLプールインスタンス
 */
export const getPool = () => {
  if (!_pool) {
    _pool = createPool();
    
    // テスト環境以外では接続情報をログ出力
    if (!isTest) {
      logDbConfig();
    }
  }
  return _pool;
};

/**
 * プールを閉じる
 */
export const closePool = async () => {
  if (_pool) {
    await _pool.end();
    _pool = null;
  }
};

/**
 * Drizzle ORMインスタンスを作成
 * @param pool PostgreSQLプール（省略時はデフォルトプールを使用）
 * @returns Drizzle ORMインスタンス
 */
export const createDb = (pool = getPool()) => {
  return drizzle(pool, { schema });
};

// デフォルトのDrizzle ORMインスタンス
export const db = createDb();

/**
 * マイグレーションを実行
 * @param db Drizzle ORMインスタンス（省略時はデフォルトインスタンスを使用）
 * @param migrationsFolder マイグレーションフォルダのパス
 */
export const runMigrations = async (
  db = createDb(),
  migrationsFolder = 'drizzle'
) => {
  console.log('🚀 マイグレーションを開始します...');
  try {
    await migrate(db, { migrationsFolder });
    console.log('✅ マイグレーションが正常に完了しました！');
  } catch (error) {
    console.error('❌ マイグレーション中にエラーが発生しました:', error);
    throw error;
  }
};

/**
 * テーブル一覧を取得
 * @param pool PostgreSQLプール（省略時はデフォルトプールを使用）
 * @returns テーブル名の配列
 */
export const listTables = async (pool = getPool()) => {
  const result = await pool.query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_type = 'BASE TABLE'
  `);
  
  return result.rows.map(row => row.table_name);
};

/**
 * データベースをリセット（publicスキーマを再作成）
 * @param pool PostgreSQLプール（省略時はデフォルトプールを使用）
 */
export const resetDatabase = async (pool = getPool()) => {
  console.log('🔄 データベースのリセットを開始します...');
  
  try {
    // publicスキーマをドロップして再作成
    await pool.query('DROP SCHEMA public CASCADE');
    await pool.query('CREATE SCHEMA public');
    await pool.query('GRANT ALL ON SCHEMA public TO postgres');
    await pool.query('GRANT ALL ON SCHEMA public TO public');
    
    console.log('✅ データベースのリセットが完了しました');
  } catch (error) {
    console.error('❌ データベースのリセット中にエラーが発生しました:', error);
    throw error;
  }
};
