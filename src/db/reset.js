import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import pkg from 'pg';
const { Pool } = pkg;
import * as dotenv from 'dotenv';

// .env.localファイルから環境変数を読み込む
dotenv.config({ path: '.env.local' });

// データベース接続設定
const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'public',
});

// データベースのリセットとマイグレーションの実行
const resetAndMigrate = async () => {
  console.log('🔄 データベースのリセットを開始します...');

  try {
    // publicスキーマをドロップして再作成
    await pool.query('DROP SCHEMA public CASCADE');
    await pool.query('CREATE SCHEMA public');

    console.log('✅ データベースのリセットが完了しました');
    console.log('🚀 マイグレーションを開始します...');

    const db = drizzle(pool);

    // migrationsディレクトリ内のマイグレーションファイルを適用
    await migrate(db, { migrationsFolder: 'drizzle' });

    console.log('✅ マイグレーションが正常に完了しました！');
    console.log('✨ データベースのリセットとマイグレーションが正常に完了しました');
  } catch (error) {
    console.error('❌ データベースのリセットまたはマイグレーション中にエラーが発生しました:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
};

resetAndMigrate();
