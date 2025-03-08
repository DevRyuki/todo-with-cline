import { drizzle } from 'drizzle-orm/node-postgres';
import pkg from 'pg';
const { Pool } = pkg;

// スキーマをインポート
import schema from './schema';

// 環境変数から接続情報を取得
const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'public',
});

// Drizzle ORM インスタンスを作成
export const db = drizzle(pool, { schema });
