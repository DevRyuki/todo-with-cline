'use client';

import React, { useState } from 'react';
import { AuthInput } from './auth-input';
import { AuthButton } from './auth-button';
import Link from 'next/link';

/**
 * パスワードリセットリクエストフォームコンポーネント
 */
export const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  /**
   * フォーム送信ハンドラー
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setError('メールアドレスを入力してください');
      return;
    }

    try {
      setIsLoading(true);
      setError('');

      // パスワードリセットリクエストAPIを呼び出し
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'パスワードリセットリクエストに失敗しました');
      }

      // リクエスト成功
      setIsSuccess(true);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('パスワードリセットリクエスト中にエラーが発生しました');
      }
      console.error('Forgot password error:', error);
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
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
          <h2 className="mt-3 text-lg font-medium text-gray-900">メール送信完了</h2>
          <p className="mt-2 text-sm text-gray-500">
            パスワードリセット用のメールを送信しました。メールに記載されているリンクからパスワードの再設定を行ってください。
          </p>
          <div className="mt-6">
            <Link
              href="/auth/signin"
              className="text-blue-600 hover:text-blue-800"
            >
              ログインページに戻る
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">パスワードをお忘れの方</h2>

      <p className="mb-6 text-sm text-gray-600">
        アカウントに登録されているメールアドレスを入力してください。パスワードリセット用のリンクをメールでお送りします。
      </p>

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

        <div className="mt-6">
          <AuthButton
            type="submit"
            disabled={isLoading}
            isLoading={isLoading}
            className="w-full"
          >
            リセットリンクを送信
          </AuthButton>
        </div>
      </form>

      <div className="mt-6 text-center">
        <Link
          href="/auth/signin"
          className="text-blue-600 hover:text-blue-800"
        >
          ログインページに戻る
        </Link>
      </div>
    </div>
  );
};
