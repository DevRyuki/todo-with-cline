import { todosFetcher } from '../todos.fetcher';
import { Todo, TodoInput, TodoUpdateInput } from '../../types';

// グローバルfetchのモック
global.fetch = jest.fn();

describe('todosFetcher', () => {
  const mockTodo: Todo = {
    id: 1,
    title: 'テストTodo',
    description: 'テスト説明',
    completed: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockTodos: Todo[] = [
    mockTodo,
    {
      id: 2,
      title: 'テストTodo 2',
      description: 'テスト説明 2',
      completed: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  // テスト前にモックをリセット
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('getAllTodos', () => {
    it('正常にTodoリストを取得する', async () => {
      // fetchのモック実装
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockTodos),
      });

      const result = await todosFetcher.getAllTodos();

      expect(global.fetch).toHaveBeenCalledWith('/api/todos');
      expect(result).toEqual(mockTodos);
    });

    it('APIエラー時に例外をスローする', async () => {
      const errorMessage = 'APIエラー';
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: jest.fn().mockResolvedValueOnce({ error: errorMessage }),
      });

      await expect(todosFetcher.getAllTodos()).rejects.toThrow(errorMessage);
      expect(global.fetch).toHaveBeenCalledWith('/api/todos');
    });
  });

  describe('getTodoById', () => {
    it('正常に特定のTodoを取得する', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockTodo),
      });

      const result = await todosFetcher.getTodoById(1);

      expect(global.fetch).toHaveBeenCalledWith('/api/todos/1');
      expect(result).toEqual(mockTodo);
    });

    it('APIエラー時に例外をスローする', async () => {
      const errorMessage = 'Todoが見つかりません';
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: jest.fn().mockResolvedValueOnce({ error: errorMessage }),
      });

      await expect(todosFetcher.getTodoById(999)).rejects.toThrow(errorMessage);
      expect(global.fetch).toHaveBeenCalledWith('/api/todos/999');
    });
  });

  describe('createTodo', () => {
    it('正常に新しいTodoを作成する', async () => {
      const todoInput: TodoInput = {
        title: '新しいTodo',
        description: '新しい説明',
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockTodo),
      });

      const result = await todosFetcher.createTodo(todoInput);

      expect(global.fetch).toHaveBeenCalledWith('/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(todoInput),
      });
      expect(result).toEqual(mockTodo);
    });

    it('APIエラー時に例外をスローする', async () => {
      const todoInput: TodoInput = {
        title: '新しいTodo',
      };
      const errorMessage = 'バリデーションエラー';

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: jest.fn().mockResolvedValueOnce({ error: errorMessage }),
      });

      await expect(todosFetcher.createTodo(todoInput)).rejects.toThrow(errorMessage);
    });
  });

  describe('updateTodo', () => {
    it('正常にTodoを更新する', async () => {
      const todoUpdate: TodoUpdateInput = {
        title: '更新されたTodo',
        completed: true,
      };
      const updatedTodo = { ...mockTodo, ...todoUpdate };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(updatedTodo),
      });

      const result = await todosFetcher.updateTodo(1, todoUpdate);

      expect(global.fetch).toHaveBeenCalledWith('/api/todos/1', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(todoUpdate),
      });
      expect(result).toEqual(updatedTodo);
    });

    it('APIエラー時に例外をスローする', async () => {
      const todoUpdate: TodoUpdateInput = {
        completed: true,
      };
      const errorMessage = 'Todoが見つかりません';

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: jest.fn().mockResolvedValueOnce({ error: errorMessage }),
      });

      await expect(todosFetcher.updateTodo(999, todoUpdate)).rejects.toThrow(errorMessage);
    });
  });

  describe('deleteTodo', () => {
    it('正常にTodoを削除する', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
      });

      const result = await todosFetcher.deleteTodo(1);

      expect(global.fetch).toHaveBeenCalledWith('/api/todos/1', {
        method: 'DELETE',
      });
      expect(result).toBe(true);
    });

    it('APIエラー時に例外をスローする', async () => {
      const errorMessage = 'Todoが見つかりません';

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: jest.fn().mockResolvedValueOnce({ error: errorMessage }),
      });

      await expect(todosFetcher.deleteTodo(999)).rejects.toThrow(errorMessage);
    });
  });

  describe('toggleTodoCompletion', () => {
    it('updateTodoを呼び出して完了状態を切り替える', async () => {
      const updatedTodo = { ...mockTodo, completed: true };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(updatedTodo),
      });

      const result = await todosFetcher.toggleTodoCompletion(1, true);

      expect(global.fetch).toHaveBeenCalledWith('/api/todos/1', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed: true }),
      });
      expect(result).toEqual(updatedTodo);
    });
  });
});
