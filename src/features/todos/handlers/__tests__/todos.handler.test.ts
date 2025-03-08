import { NextRequest } from 'next/server';
import { todosHandler } from '../todos.handler';
import { todosService } from '../../services/todos.service';

// todosServiceをモック化
jest.mock('../../services/todos.service', () => ({
  todosService: {
    getAllTodos: jest.fn(),
    getTodoById: jest.fn(),
    createTodo: jest.fn(),
    updateTodo: jest.fn(),
    deleteTodo: jest.fn(),
  },
}));

describe('todosHandler', () => {
  // テスト前にモックをリセット
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // サンプルTodoデータ
  const mockTodos = [
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

  describe('getAllTodos', () => {
    it('すべてのTodoを取得して200レスポンスを返すこと', async () => {
      // モックの戻り値を設定
      (todosService.getAllTodos as jest.Mock).mockResolvedValue(mockTodos);

      // ハンドラーを呼び出し
      const response = await todosHandler.getAllTodos();

      // レスポンスを検証
      expect(response.status).toBe(200);

      const responseBody = await response.json();

      // 日付はJSONシリアライズされるため、文字列として比較
      expect(responseBody).toHaveLength(mockTodos.length);
      expect(responseBody[0].id).toBe(mockTodos[0].id);
      expect(responseBody[0].title).toBe(mockTodos[0].title);
      expect(responseBody[0].description).toBe(mockTodos[0].description);
      expect(responseBody[0].completed).toBe(mockTodos[0].completed);

      // サービスが呼び出されたことを確認
      expect(todosService.getAllTodos).toHaveBeenCalledTimes(1);
    });

    it('エラーが発生した場合は500レスポンスを返すこと', async () => {
      // モックでエラーをスロー
      (todosService.getAllTodos as jest.Mock).mockRejectedValue(new Error('データベースエラー'));

      // ハンドラーを呼び出し
      const response = await todosHandler.getAllTodos();

      // レスポンスを検証
      expect(response.status).toBe(500);

      const responseBody = await response.json();
      expect(responseBody).toHaveProperty('error');

      // サービスが呼び出されたことを確認
      expect(todosService.getAllTodos).toHaveBeenCalledTimes(1);
    });
  });

  describe('getTodoById', () => {
    it('指定されたIDのTodoを取得して200レスポンスを返すこと', async () => {
      const mockTodo = mockTodos[0];
      (todosService.getTodoById as jest.Mock).mockResolvedValue(mockTodo);

      // ハンドラーを呼び出し
      const response = await todosHandler.getTodoById('1');

      // レスポンスを検証
      expect(response.status).toBe(200);

      const responseBody = await response.json();

      // 日付はJSONシリアライズされるため、個別に比較
      expect(responseBody.id).toBe(mockTodo.id);
      expect(responseBody.title).toBe(mockTodo.title);
      expect(responseBody.description).toBe(mockTodo.description);
      expect(responseBody.completed).toBe(mockTodo.completed);

      // サービスが正しいIDで呼び出されたことを確認
      expect(todosService.getTodoById).toHaveBeenCalledWith(1);
    });

    it('Todoが見つからない場合は404レスポンスを返すこと', async () => {
      (todosService.getTodoById as jest.Mock).mockResolvedValue(null);

      // ハンドラーを呼び出し
      const response = await todosHandler.getTodoById('999');

      // レスポンスを検証
      expect(response.status).toBe(404);

      const responseBody = await response.json();
      expect(responseBody).toHaveProperty('error');

      // サービスが正しいIDで呼び出されたことを確認
      expect(todosService.getTodoById).toHaveBeenCalledWith(999);
    });

    it('無効なIDの場合は400レスポンスを返すこと', async () => {
      // ハンドラーを呼び出し
      const response = await todosHandler.getTodoById('invalid');

      // レスポンスを検証
      expect(response.status).toBe(400);

      const responseBody = await response.json();
      expect(responseBody).toHaveProperty('error');

      // サービスが呼び出されていないことを確認
      expect(todosService.getTodoById).not.toHaveBeenCalled();
    });
  });

  describe('createTodo', () => {
    it('有効なデータで新しいTodoを作成して201レスポンスを返すこと', async () => {
      const newTodo = {
        title: '新しいTodo',
        description: '新しい説明',
      };

      const createdTodo = {
        id: 3,
        ...newTodo,
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (todosService.createTodo as jest.Mock).mockResolvedValue(createdTodo);

      // リクエストを作成
      const request = new NextRequest('http://localhost:3000/api/todos', {
        method: 'POST',
        body: JSON.stringify(newTodo),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // ハンドラーを呼び出し
      const response = await todosHandler.createTodo(request);

      // レスポンスを検証
      expect(response.status).toBe(201);

      const responseBody = await response.json();

      // 日付はJSONシリアライズされるため、個別に比較
      expect(responseBody.id).toBe(createdTodo.id);
      expect(responseBody.title).toBe(createdTodo.title);
      expect(responseBody.description).toBe(createdTodo.description);
      expect(responseBody.completed).toBe(createdTodo.completed);

      // サービスが正しいデータで呼び出されたことを確認
      expect(todosService.createTodo).toHaveBeenCalledWith(newTodo);
    });

    it('無効なデータの場合は400レスポンスを返すこと', async () => {
      // タイトルがない無効なデータ
      const invalidTodo = {
        description: '説明のみ',
      };

      // リクエストを作成
      const request = new NextRequest('http://localhost:3000/api/todos', {
        method: 'POST',
        body: JSON.stringify(invalidTodo),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // ハンドラーを呼び出し
      const response = await todosHandler.createTodo(request);

      // レスポンスを検証
      expect(response.status).toBe(400);

      const responseBody = await response.json();
      expect(responseBody).toHaveProperty('error');

      // サービスが呼び出されていないことを確認
      expect(todosService.createTodo).not.toHaveBeenCalled();
    });
  });

  describe('updateTodo', () => {
    it('有効なデータでTodoを更新して200レスポンスを返すこと', async () => {
      const todoId = '1';
      const updateData = {
        title: '更新されたタイトル',
        completed: true,
      };

      const updatedTodo = {
        id: 1,
        title: '更新されたタイトル',
        description: '説明1',
        completed: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (todosService.updateTodo as jest.Mock).mockResolvedValue(updatedTodo);

      // リクエストを作成
      const request = new NextRequest('http://localhost:3000/api/todos/1', {
        method: 'PATCH',
        body: JSON.stringify(updateData),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // ハンドラーを呼び出し
      const response = await todosHandler.updateTodo(todoId, request);

      // レスポンスを検証
      expect(response.status).toBe(200);

      const responseBody = await response.json();

      // 日付はJSONシリアライズされるため、個別に比較
      expect(responseBody.id).toBe(updatedTodo.id);
      expect(responseBody.title).toBe(updatedTodo.title);
      expect(responseBody.description).toBe(updatedTodo.description);
      expect(responseBody.completed).toBe(updatedTodo.completed);

      // サービスが正しいIDとデータで呼び出されたことを確認
      expect(todosService.updateTodo).toHaveBeenCalledWith(1, updateData);
    });

    it('Todoが見つからない場合は404レスポンスを返すこと', async () => {
      const todoId = '999';
      const updateData = {
        title: '更新されたタイトル',
      };

      (todosService.updateTodo as jest.Mock).mockResolvedValue(null);

      // リクエストを作成
      const request = new NextRequest('http://localhost:3000/api/todos/999', {
        method: 'PATCH',
        body: JSON.stringify(updateData),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // ハンドラーを呼び出し
      const response = await todosHandler.updateTodo(todoId, request);

      // レスポンスを検証
      expect(response.status).toBe(404);

      const responseBody = await response.json();
      expect(responseBody).toHaveProperty('error');

      // サービスが正しいIDとデータで呼び出されたことを確認
      expect(todosService.updateTodo).toHaveBeenCalledWith(999, updateData);
    });

    it('無効なIDの場合は400レスポンスを返すこと', async () => {
      const todoId = 'invalid';
      const updateData = {
        title: '更新されたタイトル',
      };

      // リクエストを作成
      const request = new NextRequest('http://localhost:3000/api/todos/invalid', {
        method: 'PATCH',
        body: JSON.stringify(updateData),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // ハンドラーを呼び出し
      const response = await todosHandler.updateTodo(todoId, request);

      // レスポンスを検証
      expect(response.status).toBe(400);

      const responseBody = await response.json();
      expect(responseBody).toHaveProperty('error');

      // サービスが呼び出されていないことを確認
      expect(todosService.updateTodo).not.toHaveBeenCalled();
    });
  });

  describe('deleteTodo', () => {
    it('指定されたIDのTodoを削除して204レスポンスを返すこと', async () => {
      const todoId = '1';

      (todosService.deleteTodo as jest.Mock).mockResolvedValue(true);

      // ハンドラーを呼び出し
      const response = await todosHandler.deleteTodo(todoId);

      // レスポンスを検証
      expect(response.status).toBe(204);

      // サービスが正しいIDで呼び出されたことを確認
      expect(todosService.deleteTodo).toHaveBeenCalledWith(1);
    });

    it('Todoが見つからない場合は404レスポンスを返すこと', async () => {
      const todoId = '999';

      (todosService.deleteTodo as jest.Mock).mockResolvedValue(false);

      // ハンドラーを呼び出し
      const response = await todosHandler.deleteTodo(todoId);

      // レスポンスを検証
      expect(response.status).toBe(404);

      const responseBody = await response.json();
      expect(responseBody).toHaveProperty('error');

      // サービスが正しいIDで呼び出されたことを確認
      expect(todosService.deleteTodo).toHaveBeenCalledWith(999);
    });

    it('無効なIDの場合は400レスポンスを返すこと', async () => {
      const todoId = 'invalid';

      // ハンドラーを呼び出し
      const response = await todosHandler.deleteTodo(todoId);

      // レスポンスを検証
      expect(response.status).toBe(400);

      const responseBody = await response.json();
      expect(responseBody).toHaveProperty('error');

      // サービスが呼び出されていないことを確認
      expect(todosService.deleteTodo).not.toHaveBeenCalled();
    });
  });
});
