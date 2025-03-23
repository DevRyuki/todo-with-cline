'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthInput } from './auth-input';
import { AuthButton } from './auth-button';
import Link from 'next/link';

/**
 * サインアップフォームコンポーネント
 */
export const SignUpForm = () => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  /**
   * フォーム送信ハンドラー
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError('メールアドレスとパスワードを入力してください');
      return;
    }

    if (password.length < 8) {
      setError('パスワードは8文字以上で入力してください');
      return;
    }

    try {
      setIsLoading(true);
      setError('');

      // ユーザー登録APIを呼び出し
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'ユーザー登録に失敗しました');
      }

      // 登録成功
      setIsSuccess(true);

      // 3秒後にログインページにリダイレクト
      setTimeout(() => {
        router.push('/auth/signin');
      }, 3000);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('ユーザー登録中にエラーが発生しました');
      }
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <svg
            className="mx-auto h-12 w-12 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          <h2 className="mt-3 text-lg font-medium text-gray-900">登録完了</h2>
          <p className="mt-2 text-sm text-gray-500">
            ユーザー登録が完了しました。ログインページに移動します...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md" data-testid="signup-form">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">新規登録</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <AuthInput
          id="name"
          name="name"
          type="text"
          label="名前"
          placeholder="山田 太郎"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="name"
        />

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
          placeholder="8文字以上"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
        />

        <div className="mt-6">
          <AuthButton
            type="submit"
            disabled={isLoading}
            isLoading={isLoading}
            className="w-full"
          >
            登録する
          </AuthButton>
        </div>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          すでにアカウントをお持ちの場合は
          <Link
            href="/auth/signin"
            className="text-blue-600 hover:text-blue-800 ml-1"
          >
            ログイン
          </Link>
        </p>
      </div>
    </div>
  );
};
