'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AuthInput } from './auth-input';
import { AuthButton } from './auth-button';
import Link from 'next/link';

/**
 * パスワードリセットフォームコンポーネント
 */
export const ResetPasswordForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  /**
   * フォーム送信ハンドラー
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      setError('無効なリセットトークンです');
      return;
    }

    if (!password || !confirmPassword) {
      setError('パスワードを入力してください');
      return;
    }

    if (password.length < 8) {
      setError('パスワードは8文字以上で入力してください');
      return;
    }

    if (password !== confirmPassword) {
      setError('パスワードが一致しません');
      return;
    }

    try {
      setIsLoading(true);
      setError('');

      // パスワードリセットAPIを呼び出し
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'パスワードリセットに失敗しました');
      }

      // リセット成功
      setIsSuccess(true);

      // 3秒後にログインページにリダイレクト
      setTimeout(() => {
        router.push('/auth/signin');
      }, 3000);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('パスワードリセット中にエラーが発生しました');
      }
      console.error('Reset password error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <svg
            className="mx-auto h-12 w-12 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h2 className="mt-3 text-lg font-medium text-gray-900">無効なリンク</h2>
          <p className="mt-2 text-sm text-gray-500">
            このパスワードリセットリンクは無効です。新しいリセットリンクをリクエストしてください。
          </p>
          <div className="mt-6">
            <Link
              href="/auth/forgot-password"
              className="text-blue-600 hover:text-blue-800"
            >
              パスワードリセットをリクエスト
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
          <h2 className="mt-3 text-lg font-medium text-gray-900">パスワードリセット完了</h2>
          <p className="mt-2 text-sm text-gray-500">
            パスワードが正常にリセットされました。ログインページに移動します...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">新しいパスワードの設定</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <AuthInput
          id="password"
          name="password"
          type="password"
          label="新しいパスワード"
          placeholder="8文字以上"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
        />

        <AuthInput
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          label="パスワード（確認）"
          placeholder="パスワードを再入力"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          autoComplete="new-password"
        />

        <div className="mt-6">
          <AuthButton
            type="submit"
            disabled={isLoading}
            isLoading={isLoading}
            className="w-full"
          >
            パスワードを変更
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
