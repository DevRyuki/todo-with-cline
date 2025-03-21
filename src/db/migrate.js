/**
 * データベースマイグレーションスクリプト
 * 
 * このスクリプトは、Drizzle ORMを使用してデータベースマイグレーションを実行します。
 * マイグレーションファイルは'drizzle'ディレクトリに格納されています。
 */

import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import pkg from 'pg';
const { Pool } = pkg;
import * as dotenv from 'dotenv';
import { execSync } from 'child_process';

// .env.localファイルから環境変数を読み込む
dotenv.config({ path: '.env.local' });

// データベース接続設定
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'postgres',
  ssl: process.env.NODE_ENV === 'production', // 本番環境ではSSL有効、それ以外では無効
};

console.log('データベース接続情報:', {
  host: dbConfig.host,
  port: dbConfig.port,
  user: dbConfig.user,
  database: dbConfig.database,
});

// マイグレーションの実行
const main = async () => {
  console.log('🚀 マイグレーションを開始します...');
  
  const pool = new Pool(dbConfig);

  try {
    const db = drizzle(pool);

    // migrationsディレクトリ内のマイグレーションファイルを適用
    console.log('drizzle-ormのmigrateを使用してマイグレーションを実行します...');
    await migrate(db, { migrationsFolder: 'drizzle' });
    
    console.log('drizzle-kitのpushコマンドを使用してスキーマを適用します...');
    execSync('npx drizzle-kit push', { stdio: 'inherit' });

    // マイグレーション後にテーブルが作成されたか確認
    const result = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
    `);
    
    if (result.rows.length > 0) {
      console.log('✅ 作成されたテーブル:');
      result.rows.forEach(row => {
        console.log(`   - ${row.table_name}`);
      });
    } else {
      console.warn('⚠️ テーブルが作成されていません。マイグレーションファイルを確認してください。');
    }

    console.log('✅ マイグレーションが正常に完了しました！');
  } catch (error) {
    console.error('❌ マイグレーション中にエラーが発生しました:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
};

main();
