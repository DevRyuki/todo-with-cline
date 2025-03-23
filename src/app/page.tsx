'use client';

import { useState } from 'react';
import { TodoList } from '@/features/todos/components/todo-list';
import { TodoForm } from '@/features/todos/components/todo-form';
import { useTodos } from '@/features/todos/hooks/use-todos';
import { TodoInput } from '@/features/todos/types';

export default function Home() {
  const { isLoading, error, createTodo } = useTodos();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateTodo = async (data: TodoInput) => {
    setIsSubmitting(true);
    try {
      await createTodo(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 font-[family-name:var(--font-geist-sans)] bg-gray-50">
      <header className="mb-8 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900">Todoアプリ</h1>
        <p className="text-gray-600 mt-2">効率的なタスク管理で生産性を向上させましょう</p>
      </header>
      
      <main className="max-w-2xl mx-auto">
        <div className="mb-6">
          <TodoForm onSubmit={handleCreateTodo} isLoading={isSubmitting} />
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">タスク一覧</h2>
            {isLoading && (
              <span className="text-sm text-gray-500">読み込み中...</span>
            )}
          </div>
          
          {error ? (
            <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
              <p>エラーが発生しました: {error}</p>
            </div>
          ) : (
            <TodoList />
          )}
        </div>
      </main>
    </div>
  );
}
