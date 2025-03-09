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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Todoアプリ
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            アカウントを作成して効率的なタスク管理を始めましょう
          </p>
        </div>

        <SignUpForm />
      </div>
    </div>
  );
}
