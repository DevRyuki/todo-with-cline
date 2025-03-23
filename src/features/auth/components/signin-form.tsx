'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { AuthInput } from './auth-input';
import { AuthButton } from './auth-button';
import Link from 'next/link';

/**
 * サインインフォームコンポーネント
 */
export const SignInForm = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  /**
   * フォーム送信ハンドラー
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError('メールアドレスとパスワードを入力してください');
      return;
    }

    try {
      setIsLoading(true);
      setError('');

      // NextAuthのsignInメソッドを使用して認証
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError('メールアドレスまたはパスワードが正しくありません');
        return;
      }

      // 認証成功時はホームページにリダイレクト
      router.push('/');
      router.refresh();
    } catch (error) {
      setError('ログイン中にエラーが発生しました');
      console.error('Sign in error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md" data-testid="signin-form">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">ログイン</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <AuthInput
          id="email"
          name="email"
          type="email"
          label="メールアドレス"
          placeholder="your@email.com"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />

        <AuthInput
          id="password"
          name="password"
          type="password"
          label="パスワード"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />

        <div className="flex items-center justify-between mb-6">
          <div className="text-sm">
            <Link
              href="/auth/forgot-password"
              className="text-blue-600 hover:text-blue-800"
            >
              パスワードをお忘れですか？
            </Link>
          </div>
        </div>

        <AuthButton
          type="submit"
          disabled={isLoading}
          isLoading={isLoading}
          className="w-full"
        >
          ログイン
        </AuthButton>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          アカウントをお持ちでない場合は
          <Link
            href="/auth/signup"
            className="text-blue-600 hover:text-blue-800 ml-1"
          >
            新規登録
          </Link>
        </p>
      </div>
    </div>
  );
};
