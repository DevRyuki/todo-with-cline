// テスト用の型定義
declare namespace jest {
  // モックの型定義
  interface Mock<T = unknown, Y extends unknown[] = unknown[]> {
    (...args: Y): T;
    mockImplementation(fn: (...args: Y) => T): this;
    mockReturnValue(value: T): this;
    mockResolvedValue(value: T): this;
    mockRejectedValue(value: unknown): this;
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
  // テスト環境でのみ使用される型
  interface TestDb extends TestOnly {
    insert: jest.Mock;
    select: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
  }

  // 実際のdbオブジェクトの型は保持しつつ、テスト環境では上書き
  const db: TestDb;
  export { db };
}

// AuthServiceのモック型定義
declare module '@/features/auth/services/auth.service' {
  // テスト環境でのみ使用される型
  interface TestAuthService extends TestOnly {
    registerUser: jest.Mock;
    validateUser: jest.Mock;
    generatePasswordResetToken: jest.Mock;
    resetPassword: jest.Mock;
    sendPasswordResetEmail: jest.Mock;
  }

  // 実際のAuthServiceクラスの型は保持しつつ、テスト環境では上書き
  export class AuthService implements TestAuthService {
    __test_only__: true;
    registerUser: jest.Mock;
    validateUser: jest.Mock;
    generatePasswordResetToken: jest.Mock;
    resetPassword: jest.Mock;
    sendPasswordResetEmail: jest.Mock;
  }
}
