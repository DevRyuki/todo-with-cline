import { randomBytes } from 'crypto';

/**
 * テスト用ユーザーを作成する
 * @param email メールアドレス
 * @param password パスワード
 * @param name 名前（オプション）
 * @returns 作成されたユーザー情報
 */
export async function createTestUser(
  email: string = 'test@example.com',
  password: string = 'password123',
  name: string = 'テストユーザー'
) {
  try {
    console.log(`テスト用ユーザーを作成します: ${email} (パスワード: ${password})`);
    
    // 実際のデータベース操作はスキップし、モックデータを返す
    const userId = randomBytes(16).toString('hex');
    
    return {
      id: userId,
      email,
      name,
      emailVerified: null,
      image: null,
    };
  } catch (error) {
    console.error('テストユーザー作成エラー:', error);
    throw error;
  }
}

/**
 * テスト用パスワードリセットトークンを作成する
 * @param email メールアドレス
 * @returns 作成されたトークン
 */
export async function createTestResetToken(email: string = 'test@example.com') {
  try {
    console.log(`テスト用パスワードリセットトークンを作成します: ${email}`);
    
    // 有効期限の設定（24時間後）
    const expires = new Date();
    expires.setHours(expires.getHours() + 24);

    // トークンの生成 - テスト用に固定値を使用
    const token = 'test-token-123456';

    // モックデータを返す
    return {
      identifier: email,
      token,
      expires,
    };
  } catch (error) {
    console.error('テストトークン作成エラー:', error);
    throw error;
  }
}

/**
 * テスト用ユーザーとトークンをクリーンアップする
 * @param email メールアドレス
 */
export async function cleanupTestUser(email: string = 'test@example.com') {
  try {
    console.log(`テスト用ユーザーとトークンをクリーンアップします: ${email}`);
    // 実際のデータベース操作はスキップ
  } catch (error) {
    console.error('テストユーザークリーンアップエラー:', error);
  }
}
