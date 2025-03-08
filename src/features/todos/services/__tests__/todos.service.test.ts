import { todosService } from '../todos.service';
import { db } from '@/db';
import { todos } from '@/features/todos/schemas/schema';

// dbをモック化
jest.mock('@/db', () => ({
  db: {
    select: jest.fn(),
    insert: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

describe('todosService', () => {
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
    it('すべてのTodoを取得すること', async () => {
      // モックの戻り値を設定
      (db.select as jest.Mock).mockImplementation(() => ({
        from: jest.fn().mockReturnValue(Promise.resolve(mockTodos)),
      }));

      // サービスを呼び出し
      const result = await todosService.getAllTodos();

      // 結果を検証
      expect(result).toEqual(mockTodos);

      // dbが正しく呼び出されたことを確認
      expect(db.select).toHaveBeenCalled();
    });

    it('エラーが発生した場合は例外をスローすること', async () => {
      // モックでエラーをスロー
      (db.select as jest.Mock).mockImplementation(() => ({
        from: jest.fn().mockRejectedValue(new Error('データベースエラー')),
      }));

      // サービス呼び出しでエラーが発生することを確認
      await expect(todosService.getAllTodos()).rejects.toThrow('データベースエラー');

      // dbが呼び出されたことを確認
      expect(db.select).toHaveBeenCalled();
    });
  });

  describe('getTodoById', () => {
    it('指定されたIDのTodoを取得すること', async () => {
      const mockTodo = mockTodos[0];

      // モックの戻り値を設定
      (db.select as jest.Mock).mockImplementation(() => ({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue(Promise.resolve([mockTodo])),
        }),
      }));

      // サービスを呼び出し
      const result = await todosService.getTodoById(1);

      // 結果を検証
      expect(result).toEqual(mockTodo);

      // dbが正しく呼び出されたことを確認
      expect(db.select).toHaveBeenCalled();
    });

    it('Todoが見つからない場合はnullを返すこと', async () => {
      // モックの戻り値を設定（空の配列）
      (db.select as jest.Mock).mockImplementation(() => ({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue(Promise.resolve([])),
        }),
      }));

      // サービスを呼び出し
      const result = await todosService.getTodoById(999);

      // 結果を検証
      expect(result).toBeNull();

      // dbが正しく呼び出されたことを確認
      expect(db.select).toHaveBeenCalled();
    });
  });

  describe('createTodo', () => {
    it('新しいTodoを作成すること', async () => {
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

      // モックの戻り値を設定
      (db.insert as jest.Mock).mockImplementation(() => ({
        values: jest.fn().mockReturnValue({
          returning: jest.fn().mockReturnValue(Promise.resolve([createdTodo])),
        }),
      }));

      // サービスを呼び出し
      const result = await todosService.createTodo(newTodo);

      // 結果を検証
      expect(result).toEqual(createdTodo);

      // dbが正しく呼び出されたことを確認
      expect(db.insert).toHaveBeenCalledWith(todos);
    });

    it('作成に失敗した場合は例外をスローすること', async () => {
      const newTodo = {
        title: '新しいTodo',
        description: '新しい説明',
      };

      // モックでエラーをスロー
      (db.insert as jest.Mock).mockImplementation(() => ({
        values: jest.fn().mockReturnValue({
          returning: jest.fn().mockRejectedValue(new Error('挿入エラー')),
        }),
      }));

      // サービス呼び出しでエラーが発生することを確認
      await expect(todosService.createTodo(newTodo)).rejects.toThrow('挿入エラー');

      // dbが呼び出されたことを確認
      expect(db.insert).toHaveBeenCalledWith(todos);
    });
  });

  describe('updateTodo', () => {
    it('指定されたIDのTodoを更新すること', async () => {
      const todoId = 1;
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

      // モックの戻り値を設定
      (db.update as jest.Mock).mockImplementation(() => ({
        set: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            returning: jest.fn().mockReturnValue(Promise.resolve([updatedTodo])),
          }),
        }),
      }));

      // サービスを呼び出し
      const result = await todosService.updateTodo(todoId, updateData);

      // 結果を検証
      expect(result).toEqual(updatedTodo);

      // dbが正しく呼び出されたことを確認
      expect(db.update).toHaveBeenCalledWith(todos);
    });

    it('Todoが見つからない場合はnullを返すこと', async () => {
      const todoId = 999;
      const updateData = {
        title: '更新されたタイトル',
      };

      // モックの戻り値を設定（空の配列）
      (db.update as jest.Mock).mockImplementation(() => ({
        set: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            returning: jest.fn().mockReturnValue(Promise.resolve([])),
          }),
        }),
      }));

      // サービスを呼び出し
      const result = await todosService.updateTodo(todoId, updateData);

      // 結果を検証
      expect(result).toBeNull();

      // dbが正しく呼び出されたことを確認
      expect(db.update).toHaveBeenCalledWith(todos);
    });
  });

  describe('deleteTodo', () => {
    it('指定されたIDのTodoを削除すること', async () => {
      const todoId = 1;

      // モックの戻り値を設定
      (db.delete as jest.Mock).mockImplementation(() => ({
        where: jest.fn().mockReturnValue({
          returning: jest.fn().mockReturnValue(Promise.resolve([{ id: 1 }])),
        }),
      }));

      // サービスを呼び出し
      const result = await todosService.deleteTodo(todoId);

      // 結果を検証
      expect(result).toBe(true);

      // dbが正しく呼び出されたことを確認
      expect(db.delete).toHaveBeenCalledWith(todos);
    });

    it('Todoが見つからない場合はfalseを返すこと', async () => {
      const todoId = 999;

      // モックの戻り値を設定（空の配列）
      (db.delete as jest.Mock).mockImplementation(() => ({
        where: jest.fn().mockReturnValue({
          returning: jest.fn().mockReturnValue(Promise.resolve([])),
        }),
      }));

      // サービスを呼び出し
      const result = await todosService.deleteTodo(todoId);

      // 結果を検証
      expect(result).toBe(false);

      // dbが正しく呼び出されたことを確認
      expect(db.delete).toHaveBeenCalledWith(todos);
    });
  });
});
