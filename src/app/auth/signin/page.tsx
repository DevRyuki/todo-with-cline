import React from 'react';
import { SignInForm } from '@/features/auth/components/signin-form';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ログイン | Todoアプリ',
  description: 'Todoアプリにログインしてタスク管理を始めましょう',
};

/**
 * サインインページ
 */
export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Todoアプリ
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            効率的なタスク管理を始めましょう
          </p>
        </div>

        <SignInForm />
      </div>
    </div>
  );
}
