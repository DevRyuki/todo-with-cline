'use client';

import { useTodos } from '../hooks/use-todos';
import { Todo } from '../types';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';

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
    return <div className="p-4 text-destructive" data-testid="todo-list">Todoの取得に失敗しました</div>;
  }

  if (todos.length === 0) {
    return <div className="p-4 text-center">Todoがありません</div>;
  }

  return (
    <ul className="divide-y divide-border" data-testid="todo-list">
      {todos.map((todo) => (
        <li 
          key={todo.id} 
          className="py-4 flex items-center justify-between" 
          data-testid="todo-item"
          data-completed={todo.completed ? 'true' : 'false'}
        >
          <div className="flex items-center gap-3">
            <Checkbox
              id={`todo-${todo.id}`}
              checked={todo.completed}
              onCheckedChange={() => handleToggle(todo.id, !todo.completed)}
              aria-label={`${todo.title}を${todo.completed ? '未完了' : '完了'}としてマーク`}
              data-testid="todo-toggle"
            />
            <label
              htmlFor={`todo-${todo.id}`}
              className={`${todo.completed ? 'line-through text-muted-foreground' : ''}`}
            >
              {todo.title}
            </label>
          </div>
          <div>
            <Button
              onClick={() => handleDelete(todo.id)}
              variant="ghost"
              className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
              aria-label={`${todo.title}を削除`}
              size="sm"
            >
              削除
            </Button>
          </div>
        </li>
      ))}
    </ul>
  );
};
