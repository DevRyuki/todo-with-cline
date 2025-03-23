import React from 'react';
import { SignUpForm } from '@/features/auth/components/signup-form';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '新規登録 | Todoアプリ',
  description: 'Todoアプリに新規登録してタスク管理を始めましょう',
};

/**
 * サインアップページ
 */
export default function SignUpPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Todoアプリ
          </h1>
          <p className="mt-3 text-base text-gray-600 max-w-md mx-auto">
            アカウントを作成して効率的なタスク管理を始めましょう
          </p>
        </div>

        <SignUpForm />

        <div className="mt-8 text-center text-xs text-gray-500">
          <p>アカウントを作成することで、利用規約とプライバシーポリシーに同意したことになります。</p>
        </div>
      </div>
    </div>
  );
}
