import React from 'react';
import { ForgotPasswordForm } from '@/features/auth/components/forgot-password-form';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'パスワードをお忘れの方 | Todoアプリ',
  description: 'Todoアプリのパスワードリセット',
};

/**
 * パスワードリセットリクエストページ
 */
export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Todoアプリ
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            パスワードをリセットする
          </p>
        </div>

        <ForgotPasswordForm />
      </div>
    </div>
  );
}
