/**
 * データベースリセットスクリプト
 * 
 * このスクリプトは、データベースを完全にリセットし、マイグレーションを再適用します。
 * 開発環境やテスト環境でのみ使用してください。
 */

import { 
  getPool, 
  resetDatabase, 
  runMigrations, 
  listTables, 
  closePool, 
} from './client';
import { logDbConfig } from './config';
import { execSync } from 'child_process';

// データベースのリセットとマイグレーションの実行
const resetAndMigrate = async () => {
  try {
    // 接続情報をログ出力
    logDbConfig();
    
    // プールを初期化
    getPool();
    
    // データベースをリセット
    await resetDatabase();
    
    // マイグレーションを実行
    await runMigrations();
    
    // drizzle-kitのpushコマンドを実行
    console.log('drizzle-kitのpushコマンドを使用してスキーマを適用します...');
    execSync('npx drizzle-kit push', { stdio: 'inherit' });
    
    // テーブル一覧を取得して表示
    const tables = await listTables();
    
    if (tables.length > 0) {
      console.log('✅ 作成されたテーブル:');
      tables.forEach(tableName => {
        console.log(`   - ${tableName}`);
      });
    } else {
      console.warn('⚠️ テーブルが作成されていません。マイグレーションファイルを確認してください。');
    }
    
    console.log('✅ マイグレーションが正常に完了しました！');
    console.log('✨ データベースのリセットとマイグレーションが正常に完了しました');
  } catch (error) {
    console.error('❌ データベースのリセットまたはマイグレーション中にエラーが発生しました:', error);
    process.exit(1);
  } finally {
    // 接続を閉じる
    await closePool();
  }
};

resetAndMigrate();
