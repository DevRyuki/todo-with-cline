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

// マイグレーションの実行
const main = async () => {
  console.log('🚀 マイグレーションを開始します...');
  
  try {
    const db = drizzle(pool);
    
    // migrationsディレクトリ内のマイグレーションファイルを適用
    await migrate(db, { migrationsFolder: 'drizzle' });
    
    console.log('✅ マイグレーションが正常に完了しました！');
  } catch (error) {
    console.error('❌ マイグレーション中にエラーが発生しました:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
};

main();
