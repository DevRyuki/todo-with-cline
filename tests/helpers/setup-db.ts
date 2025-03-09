import { exec } from 'child_process';
import { promisify } from 'util';

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
