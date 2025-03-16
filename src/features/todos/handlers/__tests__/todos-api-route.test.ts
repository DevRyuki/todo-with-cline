import { NextResponse } from 'next/server';
import { todosService } from '../../services/todos.service';
import { Todo } from '../../types';

// NextResponseのモック
jest.mock('next/server', () => {
  const originalModule = jest.requireActual('next/server');
  return {
    ...originalModule,
    NextResponse: {
      json: jest.fn().mockImplementation((body, init) => {
        return {
          status: init?.status || 200,
          json: async () => body,
        };
      }),
    },
  };
});

// todosServiceをモック化
jest.mock('../../services/todos.service', () => ({
  todosService: {
    getAllTodos: jest.fn(),
  },
}));

describe('Todos API Routes', () => {
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

      // APIルートをインポート
      const { GET } = require('@/app/api/todos/route');
      
      // APIルートを呼び出し
      const response = await GET();

      // レスポンスを検証
      expect(response.status).toBe(200);

      // サービスが呼び出されたことを確認
      expect(todosService.getAllTodos).toHaveBeenCalledTimes(1);
    });
  });
});
