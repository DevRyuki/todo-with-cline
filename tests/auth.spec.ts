import { test, expect } from '@playwright/test';

test.describe('認証機能', () => {
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
  });

  test('サインアップページが正しく表示される', async ({ page }) => {
    // サインアップページにアクセス
    await page.goto('/auth/signup');

    // ページタイトルを確認
    await expect(page).toHaveTitle(/サインアップ|登録|Sign up/);

    // サインアップフォームが表示されることを確認
    const signupForm = page.locator('[data-testid="signup-form"]');
    await expect(signupForm).toBeVisible();

    // メールアドレス入力欄が表示されることを確認
    const emailInput = page.locator('[data-testid="email-input"]');
    await expect(emailInput).toBeVisible();

    // パスワード入力欄が表示されることを確認
    const passwordInput = page.locator('[data-testid="password-input"]');
    await expect(passwordInput).toBeVisible();

    // サインアップボタンが表示されることを確認
    const signupButton = page.locator('[data-testid="signup-button"]');
    await expect(signupButton).toBeVisible();
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
  });
});
