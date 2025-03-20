import { test, expect } from '@playwright/test';

test.describe('認証機能', () => {
  // 基本的なページ表示テスト
  test('サインインページが正しく表示される', async ({ page }) => {
    // サインインページにアクセス
    await page.goto('/auth/signin');

    // ページタイトルを確認
    await expect(page).toHaveTitle(/サインイン|ログイン|Sign in/);

    // サインインフォームが表示されることを確認
    const signinForm = page.locator('[data-testid="signin-form"]');
    await expect(signinForm).toBeVisible();

    // メールアドレス入力欄が表示されることを確認
    const emailInput = page.locator('[data-testid="email-input"]');
    await expect(emailInput).toBeVisible();

    // パスワード入力欄が表示されることを確認
    const passwordInput = page.locator('[data-testid="password-input"]');
    await expect(passwordInput).toBeVisible();

    // サインインボタンが表示されることを確認
    const signinButton = page.locator('[data-testid="signin-button"]');
    await expect(signinButton).toBeVisible();

    // パスワードリセットリンクが表示されることを確認
    const forgotPasswordLink = page.getByText('パスワードをお忘れですか？');
    await expect(forgotPasswordLink).toBeVisible();

    // 新規登録リンクが表示されることを確認
    const signupLink = page.getByText('新規登録');
    await expect(signupLink).toBeVisible();
  });

  test('サインアップページが正しく表示される', async ({ page }) => {
    // サインアップページにアクセス
    await page.goto('/auth/signup');

    // ページタイトルを確認
    await expect(page).toHaveTitle(/サインアップ|登録|Sign up/);

    // サインアップフォームが表示されることを確認
    const signupForm = page.locator('[data-testid="signup-form"]');
    await expect(signupForm).toBeVisible();

    // 名前入力欄が表示されることを確認
    const nameInput = page.locator('[data-testid="name-input"]');
    await expect(nameInput).toBeVisible();

    // メールアドレス入力欄が表示されることを確認
    const emailInput = page.locator('[data-testid="email-input"]');
    await expect(emailInput).toBeVisible();

    // パスワード入力欄が表示されることを確認
    const passwordInput = page.locator('[data-testid="password-input"]');
    await expect(passwordInput).toBeVisible();

    // サインアップボタンが表示されることを確認
    const signupButton = page.locator('[data-testid="signup-button"]');
    await expect(signupButton).toBeVisible();

    // ログインリンクが表示されることを確認
    const signinLink = page.getByText('ログイン');
    await expect(signinLink).toBeVisible();
  });

  test('パスワードリセットページが正しく表示される', async ({ page }) => {
    // パスワードリセットページにアクセス
    await page.goto('/auth/forgot-password');

    // ページタイトルを確認
    await expect(page).toHaveTitle(/パスワードリセット|パスワードを忘れた|Forgot password/);

    // パスワードリセットフォームが表示されることを確認
    const forgotPasswordForm = page.locator('[data-testid="forgot-password-form"]');
    await expect(forgotPasswordForm).toBeVisible();

    // メールアドレス入力欄が表示されることを確認
    const emailInput = page.locator('[data-testid="email-input"]');
    await expect(emailInput).toBeVisible();

    // 送信ボタンが表示されることを確認
    const submitButton = page.locator('[data-testid="submit-button"]');
    await expect(submitButton).toBeVisible();

    // ログインページに戻るリンクが表示されることを確認
    const backToLoginLink = page.getByText('ログインページに戻る');
    await expect(backToLoginLink).toBeVisible();
  });

  // 認証フローのテスト
  test('ユーザー登録から認証までの一連のフローが正常に動作する', async ({ page }) => {
    // テスト用のユニークなメールアドレスを生成
    const uniqueId = Date.now().toString();
    const testEmail = `test-user-${uniqueId}@example.com`;
    const testPassword = 'password123';
    const testName = 'テストユーザー';

    // サインアップページにアクセス
    await page.goto('/auth/signup');

    // サインアップフォームに入力
    await page.locator('[data-testid="name-input"]').fill(testName);
    await page.locator('[data-testid="email-input"]').fill(testEmail);
    await page.locator('[data-testid="password-input"]').fill(testPassword);

    // サインアップボタンをクリック
    await page.locator('[data-testid="signup-button"]').click();

    // 登録成功メッセージが表示されることを確認
    await expect(page.getByText('登録完了')).toBeVisible();
    await expect(page.getByText('ユーザー登録が完了しました')).toBeVisible();

    // リダイレクトを待つ
    await page.waitForURL('/auth/signin');

    // サインインフォームに入力
    await page.locator('[data-testid="email-input"]').fill(testEmail);
    await page.locator('[data-testid="password-input"]').fill(testPassword);

    // サインインボタンをクリック
    await page.locator('[data-testid="signin-button"]').click();

    // ホームページにリダイレクトされることを確認
    await page.waitForURL('/');

    // ホームページのコンテンツが表示されることを確認
    await expect(page.locator('[data-testid="todo-list"]')).toBeVisible();
  });

  test('既存ユーザーが正常にサインインできる', async ({ page }) => {
    // サインインページにアクセス
    await page.goto('/auth/signin');

    // テスト用ユーザーの認証情報を入力（setup-db.tsで作成済み）
    await page.locator('[data-testid="email-input"]').fill('test@example.com');
    await page.locator('[data-testid="password-input"]').fill('password123');

    // サインインボタンをクリック
    await page.locator('[data-testid="signin-button"]').click();

    // ホームページにリダイレクトされることを確認
    await page.waitForURL('/');

    // ホームページのコンテンツが表示されることを確認
    await expect(page.locator('[data-testid="todo-list"]')).toBeVisible();
  });

  test('無効な認証情報でサインインするとエラーが表示される', async ({ page }) => {
    // サインインページにアクセス
    await page.goto('/auth/signin');

    // 無効な認証情報を入力
    await page.locator('[data-testid="email-input"]').fill('invalid@example.com');
    await page.locator('[data-testid="password-input"]').fill('wrongpassword');

    // サインインボタンをクリック
    await page.locator('[data-testid="signin-button"]').click();

    // エラーメッセージが表示されることを確認
    await expect(page.getByText('メールアドレスまたはパスワードが正しくありません')).toBeVisible();

    // ページ遷移しないことを確認
    expect(page.url()).toContain('/auth/signin');
  });

  test('パスワードリセットリクエストが正常に送信される', async ({ page }) => {
    // パスワードリセットページにアクセス
    await page.goto('/auth/forgot-password');

    // メールアドレスを入力
    await page.locator('[data-testid="email-input"]').fill('test@example.com');

    // 送信ボタンをクリック
    await page.locator('[data-testid="submit-button"]').click();

    // 成功メッセージが表示されることを確認
    await expect(page.getByText('メール送信完了')).toBeVisible();
    await expect(page.getByText('パスワードリセット用のメールを送信しました')).toBeVisible();
  });

  test('パスワードリセットページでトークンなしの場合エラーが表示される', async ({ page }) => {
    // トークンなしでパスワードリセットページにアクセス
    await page.goto('/auth/reset-password');

    // エラーメッセージが表示されることを確認
    await expect(page.getByText('無効なリンク')).toBeVisible();
    await expect(page.getByText('このパスワードリセットリンクは無効です')).toBeVisible();
  });

  test('パスワードリセットページでパスワードが一致しない場合エラーが表示される', async ({ page }) => {
    // 有効なトークンを持つパスワードリセットページにアクセス（モックトークン）
    await page.goto('/auth/reset-password?token=mock-token');

    // 新しいパスワードを入力
    await page.locator('[data-testid="password-input"]').fill('newpassword123');
    await page.locator('[data-testid="confirmPassword-input"]').fill('differentpassword');

    // 送信ボタンをクリック
    await page.locator('[data-testid="submit-button"]').click();

    // エラーメッセージが表示されることを確認
    await expect(page.getByText('パスワードが一致しません')).toBeVisible();
  });

  test('パスワードリセットが正常に完了する', async ({ page }) => {
    // setup-db.tsで作成したテストトークンを使用
    // 実際のテストでは、このトークンはsetup-db.tsのcreateTestDataで作成されたものを使用
    // ここではテスト用に固定値を使用
    await page.goto('/auth/reset-password?token=test-token-123456');

    // 新しいパスワードを入力
    await page.locator('[data-testid="password-input"]').fill('newpassword123');
    await page.locator('[data-testid="confirmPassword-input"]').fill('newpassword123');

    // 送信ボタンをクリック
    await page.locator('[data-testid="submit-button"]').click();

    // 成功メッセージが表示されることを確認
    await expect(page.getByText('パスワードリセット完了')).toBeVisible();
    await expect(page.getByText('パスワードが正常にリセットされました')).toBeVisible();

    // リダイレクトを待つ
    await page.waitForURL('/auth/signin');

    // 新しいパスワードでサインイン
    await page.locator('[data-testid="email-input"]').fill('test@example.com');
    await page.locator('[data-testid="password-input"]').fill('newpassword123');
    await page.locator('[data-testid="signin-button"]').click();

    // ホームページにリダイレクトされることを確認
    await page.waitForURL('/');

    // ホームページのコンテンツが表示されることを確認
    await expect(page.locator('[data-testid="todo-list"]')).toBeVisible();
  });

  test('ナビゲーションリンクが正しく機能する', async ({ page }) => {
    // サインインページにアクセス
    await page.goto('/auth/signin');

    // 新規登録リンクをクリック
    await page.getByText('新規登録').click();
    await expect(page.url()).toContain('/auth/signup');

    // ログインリンクをクリック
    await page.getByText('ログイン').click();
    await expect(page.url()).toContain('/auth/signin');

    // パスワードをお忘れですか？リンクをクリック
    await page.getByText('パスワードをお忘れですか？').click();
    await expect(page.url()).toContain('/auth/forgot-password');

    // ログインページに戻るリンクをクリック
    await page.getByText('ログインページに戻る').click();
    await expect(page.url()).toContain('/auth/signin');
  });

  test('認証セッションが保持される', async ({ page }) => {
    // サインインページにアクセス
    await page.goto('/auth/signin');

    // テスト用ユーザーの認証情報を入力
    await page.locator('[data-testid="email-input"]').fill('test@example.com');
    await page.locator('[data-testid="password-input"]').fill('password123');

    // サインインボタンをクリック
    await page.locator('[data-testid="signin-button"]').click();

    // ホームページにリダイレクトされることを確認
    await page.waitForURL('/');

    // ホームページのコンテンツが表示されることを確認
    await expect(page.locator('[data-testid="todo-list"]')).toBeVisible();

    // 別のページに移動してもセッションが保持されることを確認
    // 例えば、ページをリロード
    await page.reload();

    // ホームページのコンテンツが表示されることを確認（ログイン状態が保持されている）
    await expect(page.locator('[data-testid="todo-list"]')).toBeVisible();

    // 直接保護されたページにアクセスしてもセッションが保持されることを確認
    await page.goto('/');
    await expect(page.locator('[data-testid="todo-list"]')).toBeVisible();
  });

  test('サインアウトが正常に機能する', async ({ page }) => {
    // サインインページにアクセス
    await page.goto('/auth/signin');

    // テスト用ユーザーの認証情報を入力
    await page.locator('[data-testid="email-input"]').fill('test@example.com');
    await page.locator('[data-testid="password-input"]').fill('password123');

    // サインインボタンをクリック
    await page.locator('[data-testid="signin-button"]').click();

    // ホームページにリダイレクトされることを確認
    await page.waitForURL('/');

    // ホームページのコンテンツが表示されることを確認
    await expect(page.locator('[data-testid="todo-list"]')).toBeVisible();

    // サインアウトボタンをクリック
    await page.locator('[data-testid="signout-button"]').click();

    // サインインページにリダイレクトされることを確認
    await page.waitForURL('/auth/signin');

    // サインインフォームが表示されることを確認
    await expect(page.locator('[data-testid="signin-form"]')).toBeVisible();

    // 保護されたページにアクセスしようとするとサインインページにリダイレクトされることを確認
    await page.goto('/');
    await expect(page.url()).toContain('/auth/signin');
  });

  test('サインアップフォームのバリデーションが正しく機能する', async ({ page }) => {
    // サインアップページにアクセス
    await page.goto('/auth/signup');

    // 空のフォームを送信
    await page.locator('[data-testid="signup-button"]').click();

    // エラーメッセージが表示されることを確認
    await expect(page.getByText('メールアドレスとパスワードを入力してください')).toBeVisible();

    // 無効なメールアドレスを入力
    await page.locator('[data-testid="email-input"]').fill('invalid-email');
    await page.locator('[data-testid="password-input"]').fill('password123');
    await page.locator('[data-testid="signup-button"]').click();

    // エラーメッセージが表示されることを確認
    await expect(page.getByText('無効なメールアドレスです')).toBeVisible();

    // 短すぎるパスワードを入力
    await page.locator('[data-testid="email-input"]').fill('valid@example.com');
    await page.locator('[data-testid="password-input"]').fill('short');
    await page.locator('[data-testid="signup-button"]').click();

    // エラーメッセージが表示されることを確認
    await expect(page.getByText('パスワードは8文字以上で入力してください')).toBeVisible();

    // 既に登録済みのメールアドレスを入力
    await page.locator('[data-testid="email-input"]').fill('test@example.com');
    await page.locator('[data-testid="password-input"]').fill('password123');
    await page.locator('[data-testid="signup-button"]').click();

    // エラーメッセージが表示されることを確認
    await expect(page.getByText('このメールアドレスは既に登録されています')).toBeVisible();
  });

  test('サインインフォームのバリデーションが正しく機能する', async ({ page }) => {
    // サインインページにアクセス
    await page.goto('/auth/signin');

    // 空のフォームを送信
    await page.locator('[data-testid="signin-button"]').click();

    // エラーメッセージが表示されることを確認
    await expect(page.getByText('メールアドレスとパスワードを入力してください')).toBeVisible();

    // メールアドレスのみ入力
    await page.locator('[data-testid="email-input"]').fill('test@example.com');
    await page.locator('[data-testid="signin-button"]').click();

    // エラーメッセージが表示されることを確認
    await expect(page.getByText('メールアドレスとパスワードを入力してください')).toBeVisible();

    // パスワードのみ入力
    await page.locator('[data-testid="email-input"]').fill('');
    await page.locator('[data-testid="password-input"]').fill('password123');
    await page.locator('[data-testid="signin-button"]').click();

    // エラーメッセージが表示されることを確認
    await expect(page.getByText('メールアドレスとパスワードを入力してください')).toBeVisible();
  });

  test('パスワードリセットフォームのバリデーションが正しく機能する', async ({ page }) => {
    // パスワードリセットページにアクセス
    await page.goto('/auth/forgot-password');

    // 空のフォームを送信
    await page.locator('[data-testid="submit-button"]').click();

    // エラーメッセージが表示されることを確認
    await expect(page.getByText('メールアドレスを入力してください')).toBeVisible();

    // 無効なメールアドレスを入力
    await page.locator('[data-testid="email-input"]').fill('invalid-email');
    await page.locator('[data-testid="submit-button"]').click();

    // エラーメッセージが表示されることを確認
    await expect(page.getByText('無効なメールアドレスです')).toBeVisible();

    // 存在しないメールアドレスを入力
    await page.locator('[data-testid="email-input"]').fill('nonexistent@example.com');
    await page.locator('[data-testid="submit-button"]').click();

    // エラーメッセージが表示されることを確認
    await expect(page.getByText('ユーザーが見つかりません')).toBeVisible();
  });

  test('パスワードリセットページのバリデーションが正しく機能する', async ({ page }) => {
    // 有効なトークンを持つパスワードリセットページにアクセス
    await page.goto('/auth/reset-password?token=test-token-123456');

    // 空のフォームを送信
    await page.locator('[data-testid="submit-button"]').click();

    // エラーメッセージが表示されることを確認
    await expect(page.getByText('パスワードを入力してください')).toBeVisible();

    // 短すぎるパスワードを入力
    await page.locator('[data-testid="password-input"]').fill('short');
    await page.locator('[data-testid="confirmPassword-input"]').fill('short');
    await page.locator('[data-testid="submit-button"]').click();

    // エラーメッセージが表示されることを確認
    await expect(page.getByText('パスワードは8文字以上で入力してください')).toBeVisible();

    // パスワードが一致しない場合
    await page.locator('[data-testid="password-input"]').fill('password123');
    await page.locator('[data-testid="confirmPassword-input"]').fill('different123');
    await page.locator('[data-testid="submit-button"]').click();

    // エラーメッセージが表示されることを確認
    await expect(page.getByText('パスワードが一致しません')).toBeVisible();
  });
});
