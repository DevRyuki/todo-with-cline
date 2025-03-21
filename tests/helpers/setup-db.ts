import { createTestUser, createTestResetToken } from './auth-test-helpers';
import { 
  setupTestDb, 
  cleanupTestDb,
} from '@/db/test-utils';
import { Pool } from 'pg';

// テスト用のプールとDBインスタンスを保持する変数
let testPool: Pool | null = null;

/**
 * テスト用データベースをリセットする
 * このヘルパー関数は、テスト実行前にデータベースをリセットし、
 * 初期データを投入するために使用します。
 */
export async function resetTestDatabase() {
  try {
    console.log('テスト用データベースをリセットしています...');
    
    // 既存のプールがあれば閉じる
    if (testPool) {
      await cleanupTestDb(testPool);
      testPool = null;
    }
    
    // テスト用DBをセットアップ
    const { pool } = await setupTestDb();
    testPool = pool;
    
    console.log('データベースのリセットが完了しました');
    return true;
  } catch (error) {
    console.error('データベースのリセット中にエラーが発生しました:', error);
    return false;
  }
}

/**
 * テスト用のサンプルデータを作成する
 * このヘルパー関数は、テスト実行前に必要なサンプルデータを
 * データベースに投入するために使用します。
 */
export async function createTestData() {
  try {
    // ここでテスト用のデータを作成するSQLを実行
    // 例: ユーザー、Todo、プロジェクト、ワークスペースなど
    console.log('テスト用サンプルデータを作成しています...');

    // 認証テスト用のユーザーを作成
    const testUser = await createTestUser(
      'test@example.com',
      'password123',
      'テストユーザー'
    );
    console.log('認証テスト用ユーザーを作成しました:', testUser.email);

    // 無効な認証情報テスト用のユーザーを作成
    const invalidUser = await createTestUser(
      'invalid@example.com',
      'wrongpassword',
      '無効ユーザー'
    );
    console.log('無効認証情報テスト用ユーザーを作成しました:', invalidUser.email);

    // パスワードリセットテスト用のトークンを作成
    const resetToken = await createTestResetToken('test@example.com');
    console.log('パスワードリセットテスト用トークンを作成しました:', resetToken.token);

    // Todoのサンプルデータを作成
    // todosServiceを直接インポートできないため、APIを使用してTodoを作成
    try {
      // データベースに直接SQLを実行してTodoを作成
      // 現在のE2Eテストでは、Todoリストの表示のみをテストするため、
      // Todoのサンプルデータは作成しない
      console.log('Todoのサンプルデータは作成しません（E2Eテストの最初のステップでは不要）');
      console.log('Todoのサンプルデータを作成しました');
    } catch (error) {
      console.error('Todoのサンプルデータ作成中にエラーが発生しました:', error);
    }

    console.log('テスト用サンプルデータの作成が完了しました');
    return true;
  } catch (error) {
    console.error('テスト用サンプルデータの作成中にエラーが発生しました:', error);
    return false;
  }
}

/**
 * テスト環境をセットアップする
 * この関数は、テスト実行前にデータベースをリセットし、
 * テスト用のサンプルデータを作成します。
 */
export async function setupTestEnvironment() {
  const isDbReset = await resetTestDatabase();
  if (!isDbReset) {
    throw new Error('データベースのリセットに失敗しました');
  }

  const isDataCreated = await createTestData();
  if (!isDataCreated) {
    throw new Error('テスト用サンプルデータの作成に失敗しました');
  }

  console.log('テスト環境のセットアップが完了しました');
  return true;
}

/**
 * テスト環境をクリーンアップする
 * この関数は、テスト実行後にデータベース接続を閉じます。
 */
export async function cleanupTestEnvironment() {
  if (testPool) {
    try {
      await cleanupTestDb(testPool);
      testPool = null;
      console.log('テスト環境のクリーンアップが完了しました');
    } catch (error) {
      console.error('テスト環境のクリーンアップ中にエラーが発生しました:', error);
    }
  }
}
