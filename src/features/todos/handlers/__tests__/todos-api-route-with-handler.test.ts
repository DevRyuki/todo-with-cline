import { NextRequest } from 'next/server';
import { GET, POST } from '@/app/api/todos/route';
import { todosService } from '../../services/todos.service';
import { Todo } from '../../types';

// todosServiceをモック化
jest.mock('../../services/todos.service', () => ({
  todosService: {
    getAllTodos: jest.fn(),
    createTodo: jest.fn(),
  },
}));

// App RouterのAPIルートテスト
describe('Todos API Routes (App Router)', () => {
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
  ];

  describe('GET /api/todos', () => {
    it('すべてのTodoを取得して200レスポンスを返すこと', async () => {
      // モックの戻り値を設定
      (todosService.getAllTodos as jest.Mock).mockResolvedValue(mockTodos);

      // APIルートを直接呼び出し
      const response = await GET();
      
      // レスポンスを検証
      expect(response.status).toBe(200);
      
      const responseBody = await response.json();
      expect(responseBody).toEqual(mockTodos);
      
      // サービスが呼び出されたことを確認
      expect(todosService.getAllTodos).toHaveBeenCalledTimes(1);
    });
  });

  describe('POST /api/todos', () => {
    it('新しいTodoを作成して201レスポンスを返すこと', async () => {
      const newTodo = {
        title: '新しいTodo',
        description: '新しい説明',
      };
      
      const createdTodo = {
        id: 2,
        title: '新しいTodo',
        description: '新しい説明',
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // モックの戻り値を設定
      (todosService.createTodo as jest.Mock).mockResolvedValue(createdTodo);

      // リクエストオブジェクトを作成
      const request = new NextRequest('http://localhost:3000/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTodo),
      });

      // APIルートを直接呼び出し
      const response = await POST(request);
      
      // レスポンスを検証
      expect(response.status).toBe(201);
      
      const responseBody = await response.json();
      expect(responseBody).toEqual(createdTodo);
      
      // サービスが正しいパラメータで呼び出されたことを確認
      expect(todosService.createTodo).toHaveBeenCalledWith(newTodo);
    });
  });
});
