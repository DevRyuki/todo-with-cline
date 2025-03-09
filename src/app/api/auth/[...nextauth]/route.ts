import NextAuth from 'next-auth';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { db } from '@/db';
import CredentialsProvider from 'next-auth/providers/credentials';
import { AuthService } from '@/features/auth/services/auth.service';

const authService = new AuthService();

/**
 * NextAuth設定
 */
const handler = NextAuth({
  // @ts-expect-error - テスト環境でのみ型エラーが発生するため
  adapter: DrizzleAdapter(db),
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // 認証サービスを使用してユーザーを検証
          const user = await authService.validateUser(
            credentials.email,
            credentials.password
          );

          if (!user) {
            return null;
          }

          // @ts-expect-error - ユーザーオブジェクトの型が正しく推論されないため
          return {
            id: user.id,
            email: user.email,
            name: user.name,
          };
        } catch (error) {
          console.error('Authentication error:', error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  callbacks: {
    async jwt({ token, user }) {
      // 初回サインイン時にユーザー情報をトークンに追加
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      // セッションにユーザーIDを追加
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };
