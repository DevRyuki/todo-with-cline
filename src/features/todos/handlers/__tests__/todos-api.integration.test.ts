import { NextRequest } from 'next/server';
import { todosHandler } from '../todos.handler';
import { todosService } from '../../services/todos.service';
import { Todo } from '../../types';

// todosServiceの実際の実装を使用するが、DBアクセスはモック化
jest.mock('@/db', () => ({
  db: {
    select: jest.fn(),
    insert: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

describe('Todos API 統合テスト', () => {
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

  describe('GET /api/todos', () => {
    it('すべてのTodoを取得して200レスポンスを返すこと', async () => {
      // DBモックの設定
      const dbSelectMock = jest.fn().mockResolvedValue(mockTodos);
      (jest.mocked(todosService.getAllTodos) as jest.Mock).mockImplementation(() => dbSelectMock());

      // ハンドラーを呼び出し
      const response = await todosHandler.getAllTodos();

      // レスポンスを検証
      expect(response.status).toBe(200);

      const responseBody = await response.json();
      expect(responseBody).toHaveLength(mockTodos.length);
      expect(responseBody[0].id).toBe(mockTodos[0].id);
      expect(responseBody[0].title).toBe(mockTodos[0].title);
    });

    it('DBエラーが発生した場合は500レスポンスを返すこと', async () => {
      // DBモックの設定（エラー）
      const dbSelectMock = jest.fn().mockRejectedValue(new Error('データベースエラー'));
      (jest.mocked(todosService.getAllTodos) as jest.Mock).mockImplementation(() => dbSelectMock());

      // ハンドラーを呼び出し
      const response = await todosHandler.getAllTodos();

      // レスポンスを検証
      expect(response.status).toBe(500);

      const responseBody = await response.json();
      expect(responseBody).toHaveProperty('error');
    });
  });

  describe('GET /api/todos/:id', () => {
    it('指定されたIDのTodoを取得して200レスポンスを返すこと', async () => {
      // DBモックの設定
      const dbSelectMock = jest.fn().mockResolvedValue(mockTodos[0]);
      (jest.mocked(todosService.getTodoById) as jest.Mock).mockImplementation(() => dbSelectMock());

      // ハンドラーを呼び出し
      const response = await todosHandler.getTodoById('1');

      // レスポンスを検証
      expect(response.status).toBe(200);

      const responseBody = await response.json();
      expect(responseBody.id).toBe(mockTodos[0].id);
      expect(responseBody.title).toBe(mockTodos[0].title);
    });

    it('Todoが見つからない場合は404レスポンスを返すこと', async () => {
      // DBモックの設定（null）
      const dbSelectMock = jest.fn().mockResolvedValue(null);
      (jest.mocked(todosService.getTodoById) as jest.Mock).mockImplementation(() => dbSelectMock());

      // ハンドラーを呼び出し
      const response = await todosHandler.getTodoById('999');

      // レスポンスを検証
      expect(response.status).toBe(404);

      const responseBody = await response.json();
      expect(responseBody).toHaveProperty('error');
    });
  });

  describe('POST /api/todos', () => {
    it('有効なデータで新しいTodoを作成して201レスポンスを返すこと', async () => {
      // 新しいTodoデータ
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

      // DBモックの設定
      const dbInsertMock = jest.fn().mockResolvedValue(createdTodo);
      (jest.mocked(todosService.createTodo) as jest.Mock).mockImplementation(() => dbInsertMock());

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
      expect(responseBody.id).toBe(createdTodo.id);
      expect(responseBody.title).toBe(createdTodo.title);
    });

    it('無効なデータの場合は400レスポンスを返すこと', async () => {
      // 無効なデータ（タイトルなし）
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
    });
  });

  describe('PATCH /api/todos/:id', () => {
    it('有効なデータでTodoを更新して200レスポンスを返すこと', async () => {
      // 更新データ
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

      // DBモックの設定
      const dbUpdateMock = jest.fn().mockResolvedValue(updatedTodo);
      (jest.mocked(todosService.updateTodo) as jest.Mock).mockImplementation(() => dbUpdateMock());

      // リクエストを作成
      const request = new NextRequest('http://localhost:3000/api/todos/1', {
        method: 'PATCH',
        body: JSON.stringify(updateData),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // ハンドラーを呼び出し
      const response = await todosHandler.updateTodo('1', request);

      // レスポンスを検証
      expect(response.status).toBe(200);

      const responseBody = await response.json();
      expect(responseBody.id).toBe(updatedTodo.id);
      expect(responseBody.title).toBe(updatedTodo.title);
      expect(responseBody.completed).toBe(updatedTodo.completed);
    });

    it('Todoが見つからない場合は404レスポンスを返すこと', async () => {
      // 更新データ
      const updateData = {
        title: '更新されたタイトル',
      };

      // DBモックの設定（null）
      const dbUpdateMock = jest.fn().mockResolvedValue(null);
      (jest.mocked(todosService.updateTodo) as jest.Mock).mockImplementation(() => dbUpdateMock());

      // リクエストを作成
      const request = new NextRequest('http://localhost:3000/api/todos/999', {
        method: 'PATCH',
        body: JSON.stringify(updateData),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // ハンドラーを呼び出し
      const response = await todosHandler.updateTodo('999', request);

      // レスポンスを検証
      expect(response.status).toBe(404);

      const responseBody = await response.json();
      expect(responseBody).toHaveProperty('error');
    });
  });

  describe('DELETE /api/todos/:id', () => {
    it('指定されたIDのTodoを削除して204レスポンスを返すこと', async () => {
      // DBモックの設定
      const dbDeleteMock = jest.fn().mockResolvedValue(true);
      (jest.mocked(todosService.deleteTodo) as jest.Mock).mockImplementation(() => dbDeleteMock());

      // ハンドラーを呼び出し
      const response = await todosHandler.deleteTodo('1');

      // レスポンスを検証
      expect(response.status).toBe(204);
    });

    it('Todoが見つからない場合は404レスポンスを返すこと', async () => {
      // DBモックの設定（false）
      const dbDeleteMock = jest.fn().mockResolvedValue(false);
      (jest.mocked(todosService.deleteTodo) as jest.Mock).mockImplementation(() => dbDeleteMock());

      // ハンドラーを呼び出し
      const response = await todosHandler.deleteTodo('999');

      // レスポンスを検証
      expect(response.status).toBe(404);

      const responseBody = await response.json();
      expect(responseBody).toHaveProperty('error');
    });
  });
});
