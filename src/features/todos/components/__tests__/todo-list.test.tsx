import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { TodoList } from '../todo-list';
import { Todo } from '../../types';
import '@testing-library/jest-dom';

// fetchのモック
global.fetch = jest.fn();

describe('TodoList', () => {
  // テスト前にモックをリセット
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // サンプルTodoデータ
  const mockTodos: Todo[] = [
    {
      id: 1,
      title: 'テストTodo 1',
      description: '説明1',
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      title: 'テストTodo 2',
      description: '説明2',
      completed: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  describe('初期表示', () => {
    it('initialTodosが指定されている場合、APIを呼び出さずにTodoを表示すること', () => {
      // コンポーネントをレンダリング
      render(<TodoList initialTodos={mockTodos} />);

      // Todoが表示されていることを確認
      expect(screen.getByText('テストTodo 1')).toBeInTheDocument();
      expect(screen.getByText('テストTodo 2')).toBeInTheDocument();

      // APIが呼び出されていないことを確認
      expect(fetch).not.toHaveBeenCalled();
    });

    it('initialTodosが指定されていない場合、APIを呼び出してTodoを取得すること', async () => {
      // fetchのモック実装
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockTodos),
      });

      // コンポーネントをレンダリング
      render(<TodoList />);

      // 読み込み中の表示を確認
      expect(screen.getByText('読み込み中...')).toBeInTheDocument();

      // APIが呼び出されたことを確認
      expect(fetch).toHaveBeenCalledWith('/api/todos');

      // Todoが表示されるまで待機
      await waitFor(() => {
        expect(screen.getByText('テストTodo 1')).toBeInTheDocument();
        expect(screen.getByText('テストTodo 2')).toBeInTheDocument();
      });
    });

    it('APIエラーが発生した場合、エラーメッセージを表示すること', async () => {
      // fetchのモック実装（エラー）
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      // コンポーネントをレンダリング
      render(<TodoList />);

      // エラーメッセージが表示されるまで待機
      await waitFor(() => {
        expect(screen.getByText('Todoの取得に失敗しました')).toBeInTheDocument();
      });
    });

    it('Todoが空の場合、メッセージを表示すること', async () => {
      // fetchのモック実装（空の配列）
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce([]),
      });

      // コンポーネントをレンダリング
      render(<TodoList />);

      // メッセージが表示されるまで待機
      await waitFor(() => {
        expect(screen.getByText('Todoがありません')).toBeInTheDocument();
      });
    });
  });

  describe('Todo操作', () => {
    it('完了状態を切り替えると、APIが呼び出されること', async () => {
      // fetchのモック実装（更新成功）
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce({
          ...mockTodos[0],
          completed: true,
        }),
      });

      // コンポーネントをレンダリング
      render(<TodoList initialTodos={mockTodos} />);

      // チェックボックスをクリック
      const checkbox = screen.getAllByRole('checkbox')[0];
      fireEvent.click(checkbox);

      // APIが正しく呼び出されたことを確認
      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith('/api/todos/1', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ completed: true }),
        });
      });
    });

    it('削除ボタンをクリックすると、APIが呼び出されること', async () => {
      // fetchのモック実装（削除成功）
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
      });

      // コンポーネントをレンダリング
      render(<TodoList initialTodos={mockTodos} />);

      // 削除ボタンをクリック
      const deleteButton = screen.getAllByText('削除')[0];
      fireEvent.click(deleteButton);

      // APIが正しく呼び出されたことを確認
      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith('/api/todos/1', {
          method: 'DELETE',
        });
      });

      // Todoが削除されたことを確認
      await waitFor(() => {
        expect(screen.queryByText('テストTodo 1')).not.toBeInTheDocument();
        expect(screen.getByText('テストTodo 2')).toBeInTheDocument();
      });
    });

    it('コールバック関数が指定されている場合、APIの代わりにコールバックが呼び出されること', async () => {
      // モックコールバック
      const mockToggle = jest.fn().mockResolvedValue(undefined);
      const mockDelete = jest.fn().mockResolvedValue(undefined);

      // コンポーネントをレンダリング
      render(
        <TodoList
          initialTodos={mockTodos}
          onTodoToggle={mockToggle}
          onTodoDelete={mockDelete}
        />
      );

      // チェックボックスをクリック
      const checkbox = screen.getAllByRole('checkbox')[0];
      fireEvent.click(checkbox);

      // 削除ボタンをクリック
      const deleteButton = screen.getAllByText('削除')[0];
      fireEvent.click(deleteButton);

      // コールバックが呼び出されたことを確認
      await waitFor(() => {
        expect(mockToggle).toHaveBeenCalledWith(1, true);
        expect(mockDelete).toHaveBeenCalledWith(1);
      });

      // APIが呼び出されていないことを確認
      expect(fetch).not.toHaveBeenCalled();
    });
  });
});
