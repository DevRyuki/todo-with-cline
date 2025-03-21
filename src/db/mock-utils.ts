/**
 * テスト用のモックユーティリティ
 * 
 * このモジュールは、テスト環境でのデータベースモックを簡単に作成するための
 * ユーティリティ関数を提供します。
 */

import { jest } from '@jest/globals';

/**
 * DBモックを作成
 * @returns DBモック
 */
export const createMockDb = () => {
  return {
    select: jest.fn(),
    insert: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };
};

/**
 * DBモックを設定
 * @param mockDb DBモック
 * @param options モックの設定オプション
 */
export const setupMockDb = (
  mockDb: ReturnType<typeof createMockDb>,
  options: {
    selectResult?: unknown;
    insertResult?: unknown;
    updateResult?: unknown;
    deleteResult?: unknown;
  } = {}
) => {
  // selectのモック設定
  if (options.selectResult !== undefined) {
    mockDb.select.mockImplementation(() => ({
      from: jest.fn().mockReturnValue({
        // @ts-expect-error - mockResolvedValueの引数型エラーを無視
        where: jest.fn().mockResolvedValue(options.selectResult),
      }),
    }));
  }

  // insertのモック設定
  if (options.insertResult !== undefined) {
    mockDb.insert.mockImplementation(() => ({
      values: jest.fn().mockReturnValue({
        // @ts-expect-error - mockResolvedValueの引数型エラーを無視
        returning: jest.fn().mockResolvedValue(options.insertResult),
      }),
    }));
  }

  // updateのモック設定
  if (options.updateResult !== undefined) {
    mockDb.update.mockImplementation(() => ({
      set: jest.fn().mockReturnValue({
        where: jest.fn().mockReturnValue({
          // @ts-expect-error - mockResolvedValueの引数型エラーを無視
          returning: jest.fn().mockResolvedValue(options.updateResult),
        }),
      }),
    }));
  }

  // deleteのモック設定
  if (options.deleteResult !== undefined) {
    mockDb.delete.mockImplementation(() => ({
      where: jest.fn().mockReturnValue({
        // @ts-expect-error - mockResolvedValueの引数型エラーを無視
        returning: jest.fn().mockResolvedValue(options.deleteResult),
      }),
    }));
  }

  return mockDb;
};
