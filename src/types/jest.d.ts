// テスト用の型定義
declare namespace jest {
  // モックの型定義
  interface Mock<T = unknown, Y extends unknown[] = unknown[]> {
    (...args: Y): T;
    mockImplementation(fn: (...args: Y) => T): this;
    mockReturnValue(value: T): this;
    mockResolvedValue(value: T): this;
    mockRejectedValue(value: unknown): this;
    mockReturnThis(): this;
    mockClear(): this;
    mockReset(): this;
    mockRestore(): this;
    getMockName(): string;
    mockName(name: string): this;
    mock: {
      calls: Y[];
      instances: T[];
      invocationCallOrder: number[];
      results: { type: string; value: T }[];
    };
  }
}

// テスト環境でのみ使用される型定義
declare global {
  // テスト環境でのみ使用される型
  interface TestOnly {
    __test_only__: true;
  }
}

// テスト用のモジュール型定義
declare module '@/db' {
  import { PgTable } from 'drizzle-orm/pg-core';
  
  // 戻り値の型
  type DbReturnType = {
    from: jest.Mock<{
      where: jest.Mock<Promise<unknown[]>, [unknown]>;
    }, []>;
    values: jest.Mock<{
      returning: jest.Mock<Promise<unknown[]>, []>;
    }, [unknown]>;
    set: jest.Mock<{
      where: jest.Mock<{
        returning: jest.Mock<Promise<unknown[]>, []>;
      }, [unknown]>;
    }, [unknown]>;
    where: jest.Mock<{
      returning: jest.Mock<Promise<unknown[]>, []>;
    }, [unknown]>;
  };

  // テスト環境でのみ使用される型
  interface TestDb extends TestOnly {
    insert: jest.Mock<DbReturnType, [PgTable<Record<string, unknown>>]>;
    select: jest.Mock<DbReturnType, unknown[]>;
    update: jest.Mock<DbReturnType, [PgTable<Record<string, unknown>>]>;
    delete: jest.Mock<DbReturnType, [PgTable<Record<string, unknown>>]>;
  }

  // 実際のdbオブジェクトの型は保持しつつ、テスト環境では上書き
  const db: TestDb;
  export { db };
}

// AuthServiceのモック型定義
declare module '@/features/auth/services/auth.service' {
  // テスト環境でのみ使用される型
  interface TestAuthService extends TestOnly {
    registerUser: jest.Mock<Promise<{ id: string; email: string; name: string }>, [{ email: string; password: string; name: string }]>;
    validateUser: jest.Mock<Promise<{ id: string; email: string; name: string } | null>, [string, string]>;
    generatePasswordResetToken: jest.Mock<Promise<{ identifier: string; token: string; expires: Date }>, [string]>;
    resetPassword: jest.Mock<Promise<boolean>, [string, string]>;
    sendPasswordResetEmail: jest.Mock<Promise<void>, [{ identifier: string; token: string; expires: Date }, string | undefined]>;
  }

  // 実際のAuthServiceクラスの型は保持しつつ、テスト環境では上書き
  export class AuthService implements TestAuthService {
    __test_only__: true;
    registerUser: jest.Mock<Promise<{ id: string; email: string; name: string }>, [{ email: string; password: string; name: string }]>;
    validateUser: jest.Mock<Promise<{ id: string; email: string; name: string } | null>, [string, string]>;
    generatePasswordResetToken: jest.Mock<Promise<{ identifier: string; token: string; expires: Date }>, [string]>;
    resetPassword: jest.Mock<Promise<boolean>, [string, string]>;
    sendPasswordResetEmail: jest.Mock<Promise<void>, [{ identifier: string; token: string; expires: Date }, string | undefined]>;
  }
}

// TodosServiceのモック型定義
declare module '@/features/todos/services/todos.service' {
  // TodoInputとTodoUpdateInputの型定義
  interface TodoInput {
    title: string;
    description?: string;
    completed?: boolean;
  }

  interface TodoUpdateInput {
    title?: string;
    description?: string;
    completed?: boolean;
  }

  // Todo型の定義
  interface Todo {
    id: number;
    title: string;
    description?: string;
    completed: boolean;
    createdAt: Date;
    updatedAt: Date;
  }

  // テスト環境でのみ使用される型
  interface TestTodosService extends TestOnly {
    getAllTodos: jest.Mock<Promise<Todo[]>, []>;
    getTodoById: jest.Mock<Promise<Todo | null>, [number]>;
    createTodo: jest.Mock<Promise<Todo>, [TodoInput]>;
    updateTodo: jest.Mock<Promise<Todo | null>, [number, TodoUpdateInput]>;
    deleteTodo: jest.Mock<Promise<boolean>, [number]>;
  }

  // 実際のtodosServiceオブジェクトの型は保持しつつ、テスト環境では上書き
  export const todosService: TestTodosService;
}
