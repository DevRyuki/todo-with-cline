import { test, expect } from '@playwright/test';

test.describe('Todoアプリケーション', () => {
  test('ホームページが正しく表示される', async ({ page }) => {
    // ホームページにアクセス
    await page.goto('/');

    // ページタイトルを確認
    await expect(page).toHaveTitle(/Todo/);
  });

  test('Todoリストが表示される', async ({ page }) => {
    // ホームページにアクセス
    await page.goto('/');

    // Todoリストのコンテナが表示されることを確認
    const todoList = page.locator('[data-testid="todo-list"]');
    await expect(todoList).toBeVisible();
  });

  test('Todoの完了状態を切り替えられる', async ({ page }) => {
    // ホームページにアクセス
    await page.goto('/');

    // 最初のTodoアイテムを取得
    const firstTodoItem = page.locator('[data-testid="todo-item"]').first();

    // 最初のTodoアイテムが表示されることを確認
    await expect(firstTodoItem).toBeVisible();

    // 完了状態を取得
    const isCompletedBefore = await firstTodoItem.getAttribute('data-completed');

    // 完了状態切り替えボタンをクリック
    await firstTodoItem.locator('[data-testid="todo-toggle"]').click();

    // 完了状態が切り替わったことを確認
    const isCompletedAfter = await firstTodoItem.getAttribute('data-completed');
    expect(isCompletedBefore).not.toEqual(isCompletedAfter);
  });
});
