'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthInput } from './auth-input';
import { AuthButton } from './auth-button';
import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';

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
      <div className="w-full max-w-md mx-auto p-8 bg-card rounded-xl shadow-sm border border-border">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-primary/10">
            <CheckCircle2 className="h-10 w-10 text-primary" />
          </div>
          <h2 className="mt-4 text-xl font-semibold">登録完了</h2>
          <p className="mt-3 text-muted-foreground">
            ユーザー登録が完了しました。ログインページに移動します...
          </p>
          <div className="mt-6 animate-pulse">
            <div className="h-1 w-24 mx-auto bg-muted rounded-full"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto p-8 bg-card rounded-xl shadow-sm border border-border transition-all duration-300" data-testid="signup-form">
      <h2 className="text-2xl font-bold text-center mb-6">新規アカウント作成</h2>

      {error && (
        <div className="mb-6 p-4 bg-destructive/10 border-l-4 border-destructive text-destructive rounded-md flex items-start">
          <svg className="h-5 w-5 mr-2 mt-0.5 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <AuthInput
          id="name"
          name="name"
          type="text"
          label="お名前"
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
          placeholder="8文字以上の強力なパスワード"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
        />

        <div className="mt-8">
          <AuthButton
            type="submit"
            disabled={isLoading}
            isLoading={isLoading}
            className="w-full py-3"
          >
            アカウント作成
          </AuthButton>
        </div>
      </form>

      <div className="mt-8 text-center border-t border-border pt-6">
        <p className="text-sm text-muted-foreground">
          すでにアカウントをお持ちの場合は
          <Link
            href="/auth/signin"
            className="text-primary hover:text-primary/90 font-medium ml-1 transition-colors"
          >
            ログイン
          </Link>
        </p>
      </div>
    </div>
  );
};
