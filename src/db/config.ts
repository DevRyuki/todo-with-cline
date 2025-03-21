import * as dotenv from 'dotenv';

// .env.localファイルから環境変数を読み込む
dotenv.config({ path: '.env.local' });

// 環境変数の検証と設定
export const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'postgres',
  ssl: process.env.NODE_ENV === 'production', // 本番環境ではSSL有効、それ以外では無効
};

// 環境の判定
export const isProduction = process.env.NODE_ENV === 'production';
export const isTest = process.env.NODE_ENV === 'test';
export const isDevelopment = !isProduction && !isTest;

// 設定情報のログ出力（デバッグ用）
export const logDbConfig = () => {
  // テスト環境ではパスワードを表示しない
  const configForLog = {
    ...dbConfig,
    password: isTest ? '[REDACTED]' : dbConfig.password,
  };
  
  console.log('データベース接続情報:', configForLog);
};
