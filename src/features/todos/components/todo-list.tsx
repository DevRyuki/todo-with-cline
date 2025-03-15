'use client';

import { useTodos } from '../hooks/use-todos';
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
  const {
    todos,
    isLoading,
    error,
    toggleTodoCompletion,
    deleteTodo,
  } = useTodos({ initialTodos });

  // Todo完了状態の切り替え
  const handleToggle = async (id: number, completed: boolean) => {
    try {
      if (onTodoToggle) {
        await onTodoToggle(id, completed);
      } else {
        await toggleTodoCompletion(id, completed);
      }
    } catch (err) {
      console.error('Todo更新エラー:', err);
    }
  };

  // Todo削除
  const handleDelete = async (id: number) => {
    try {
      if (onTodoDelete) {
        await onTodoDelete(id);
      } else {
        await deleteTodo(id);
      }
    } catch (err) {
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
