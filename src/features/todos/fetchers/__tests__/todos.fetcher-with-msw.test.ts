import { todosFetcher } from '../todos.fetcher';
import { server } from '@/test/msw-setup';
import { http, HttpResponse } from 'msw';
import { Todo } from '../../types';

// MSWを使用したtodosFetcherのテスト
describe('todosFetcher with MSW', () => {
  // テスト用のモックデータ
  const mockTodo: Todo = {
    id: 1,
    title: 'テストTodo',
    description: 'テスト説明',
    completed: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  describe('getAllTodos', () => {
    it('正常にTodoリストを取得する', async () => {
      // MSWのデフォルトハンドラーを使用
      const todos = await todosFetcher.getAllTodos();
      
      // 結果を検証
      expect(todos.length).toBeGreaterThan(0);
      expect(todos[0].title).toBeDefined();
    });

    it('APIエラー時に例外をスローする', async () => {
      // 一時的にエラーを返すハンドラーを追加
      server.use(
        http.get('/api/todos', () => {
          return new HttpResponse(
            JSON.stringify({ error: 'APIエラー' }),
            { status: 500 }
          );
        })
      );

      // エラーがスローされることを検証
      await expect(todosFetcher.getAllTodos()).rejects.toThrow('APIエラー');
    });
  });

  describe('getTodoById', () => {
    it('正常に特定のTodoを取得する', async () => {
      const todo = await todosFetcher.getTodoById(1);
      
      expect(todo.id).toBe(1);
      expect(todo.title).toBeDefined();
    });

    it('存在しないIDの場合に例外をスローする', async () => {
      await expect(todosFetcher.getTodoById(999)).rejects.toThrow('Todoが見つかりません');
    });
  });

  describe('createTodo', () => {
    it('正常に新しいTodoを作成する', async () => {
      const todoInput = {
        title: '新しいTodo',
        description: '新しい説明',
      };

      const newTodo = await todosFetcher.createTodo(todoInput);
      
      expect(newTodo.id).toBeDefined();
      expect(newTodo.title).toBe(todoInput.title);
      expect(newTodo.description).toBe(todoInput.description);
    });

    it('無効なデータの場合に例外をスローする', async () => {
      // 一時的にバリデーションエラーを返すハンドラーを追加
      server.use(
        http.post('/api/todos', () => {
          return new HttpResponse(
            JSON.stringify({ error: 'タイトルは必須です' }),
            { status: 400 }
          );
        })
      );

      const invalidTodo = { title: '' };
      await expect(todosFetcher.createTodo(invalidTodo)).rejects.toThrow('タイトルは必須です');
    });
  });

  describe('updateTodo', () => {
    it('正常にTodoを更新する', async () => {
      const todoUpdate = {
        title: '更新されたTodo',
        completed: true,
      };

      const updatedTodo = await todosFetcher.updateTodo(1, todoUpdate);
      
      expect(updatedTodo.id).toBe(1);
      expect(updatedTodo.title).toBe(todoUpdate.title);
      expect(updatedTodo.completed).toBe(todoUpdate.completed);
    });

    it('存在しないIDの場合に例外をスローする', async () => {
      const todoUpdate = { completed: true };
      await expect(todosFetcher.updateTodo(999, todoUpdate)).rejects.toThrow('Todoが見つかりません');
    });
  });

  describe('deleteTodo', () => {
    it('正常にTodoを削除する', async () => {
      const result = await todosFetcher.deleteTodo(1);
      expect(result).toBe(true);
    });

    it('存在しないIDの場合に例外をスローする', async () => {
      await expect(todosFetcher.deleteTodo(999)).rejects.toThrow('Todoが見つかりません');
    });
  });

  describe('toggleTodoCompletion', () => {
    it('Todoの完了状態を切り替える', async () => {
      // 特定のレスポンスを返すハンドラーを追加
      server.use(
        http.patch('/api/todos/1', () => {
          return HttpResponse.json({
            ...mockTodo,
            completed: true,
            updatedAt: new Date(),
          });
        })
      );

      const updatedTodo = await todosFetcher.toggleTodoCompletion(1, true);
      
      expect(updatedTodo.id).toBe(1);
      expect(updatedTodo.completed).toBe(true);
    });
  });
});
