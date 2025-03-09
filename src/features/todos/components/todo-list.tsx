'use client';

import { useState, useEffect } from 'react';
import { Todo } from '../types';

interface TodoListProps {
  initialTodos?: Todo[];
  onTodoToggle?: (id: number, completed: boolean) => Promise<void>;
  onTodoDelete?: (id: number) => Promise<void>;
}

/**
 * Todoリストを表示するコンポーネント
 *
 * @param initialTodos 初期表示するTodoリスト（オプション）
 * @param onTodoToggle Todo完了状態切り替え時のコールバック
 * @param onTodoDelete Todo削除時のコールバック
 */
export const TodoList = ({
  initialTodos,
  onTodoToggle,
  onTodoDelete,
}: TodoListProps) => {
  const [todos, setTodos] = useState<Todo[]>(initialTodos || []);
  const [isLoading, setIsLoading] = useState(!initialTodos);
  const [error, setError] = useState<string | null>(null);

  // 初期Todoがない場合はAPIから取得
  useEffect(() => {
    if (!initialTodos) {
      fetchTodos();
    }
  }, [initialTodos]);

  // Todoリストを取得
  const fetchTodos = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/todos');

      if (!response.ok) {
        throw new Error('Todoの取得に失敗しました');
      }

      const data = await response.json();
      setTodos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '予期しないエラーが発生しました');
      console.error('Todoの取得エラー:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Todo完了状態の切り替え
  const handleToggle = async (id: number, completed: boolean) => {
    try {
      if (onTodoToggle) {
        await onTodoToggle(id, completed);
      } else {
        // デフォルトの動作
        const response = await fetch(`/api/todos/${id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ completed }),
        });

        if (!response.ok) {
          throw new Error('Todoの更新に失敗しました');
        }

        // 成功したら状態を更新
        setTodos(todos.map(todo =>
          todo.id === id ? { ...todo, completed } : todo
        ));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '予期しないエラーが発生しました');
      console.error('Todo更新エラー:', err);
    }
  };

  // Todo削除
  const handleDelete = async (id: number) => {
    try {
      if (onTodoDelete) {
        await onTodoDelete(id);
      } else {
        // デフォルトの動作
        const response = await fetch(`/api/todos/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Todoの削除に失敗しました');
        }

        // 成功したら状態を更新
        setTodos(todos.filter(todo => todo.id !== id));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '予期しないエラーが発生しました');
      console.error('Todo削除エラー:', err);
    }
  };

  if (isLoading) {
    return <div className="p-4 text-center">読み込み中...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  if (todos.length === 0) {
    return <div className="p-4 text-center">Todoがありません</div>;
  }

  return (
    <ul className="divide-y divide-gray-200">
      {todos.map((todo) => (
        <li key={todo.id} className="py-4 flex items-center justify-between">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => handleToggle(todo.id, !todo.completed)}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              aria-label={`${todo.title}を${todo.completed ? '未完了' : '完了'}としてマーク`}
            />
            <span
              className={`ml-3 ${todo.completed ? 'line-through text-gray-500' : ''}`}
            >
              {todo.title}
            </span>
          </div>
          <div>
            <button
              onClick={() => handleDelete(todo.id)}
              className="text-red-500 hover:text-red-700"
              aria-label={`${todo.title}を削除`}
            >
              削除
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};
