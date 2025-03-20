import { exec } from 'child_process';
import { promisify } from 'util';
import { createTestUser, createTestResetToken } from './auth-test-helpers';

const execAsync = promisify(exec);

/**
 * テスト用データベースをリセットする
 * このヘルパー関数は、テスト実行前にデータベースをリセットし、
 * 初期データを投入するために使用します。
 */
export async function resetTestDatabase() {
  try {
    // データベースをリセット
    console.log('テスト用データベースをリセットしています...');
    await execAsync('npm run db:reset');
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

    // 実際のデータ作成ロジックはプロジェクトの要件に合わせて実装

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
