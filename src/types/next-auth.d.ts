import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  /**
   * セッションのユーザー型を拡張してIDを含める
   */
  interface Session {
    user: {
      id: string;
    } & DefaultSession['user'];
  }

  /**
   * ユーザー型を拡張してIDを含める
   */
  interface User {
    id: string;
    email: string;
    name?: string | null;
  }
}

declare module 'next-auth/jwt' {
  /**
   * JWTトークンを拡張してIDを含める
   */
  interface JWT {
    id: string;
  }
}

// 認証サービスのユーザー型定義
declare module '@/features/auth/services/auth.service' {
  interface UserData {
    id: string;
    email: string;
    name?: string | null;
  }
}
