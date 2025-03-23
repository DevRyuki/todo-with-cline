'use client';

import React, { useState } from 'react';
import { TodoInput } from '../types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';

interface TodoFormProps {
  onSubmit: (data: TodoInput) => Promise<void>;
  isLoading?: boolean;
}

/**
 * Todo作成フォームコンポーネント
 */
export const TodoForm: React.FC<TodoFormProps> = ({ onSubmit, isLoading = false }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('タイトルを入力してください');
      return;
    }
    
    try {
      setError(null);
      await onSubmit({ 
        title: title.trim(), 
        description: description.trim() || undefined,
      });
      
      // フォームをリセット
      setTitle('');
      setDescription('');
      setIsExpanded(false);
    } catch (err) {
      setError('Todoの作成に失敗しました');
      console.error('Todo作成エラー:', err);
    }
  };

  return (
    <div className="mb-6 bg-background rounded-lg shadow-sm border border-input overflow-hidden" data-testid="todo-form">
      <form onSubmit={handleSubmit} className="p-4">
        <div className="mb-3">
          <div className="flex items-center gap-2">
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="新しいタスクを入力..."
              data-testid="todo-title-input"
              onFocus={() => setIsExpanded(true)}
            />
            {!isExpanded && (
              <Button
                type="submit"
                disabled={isLoading || !title.trim()}
                data-testid="todo-quick-submit"
              >
                追加
              </Button>
            )}
          </div>
        </div>

        {isExpanded && (
          <>
            <div className="mb-4">
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="詳細を入力（任意）..."
                rows={3}
                data-testid="todo-description-input"
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsExpanded(false)}
                data-testid="todo-cancel"
              >
                キャンセル
              </Button>
              <Button
                type="submit"
                disabled={isLoading || !title.trim()}
                data-testid="todo-submit"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    保存中...
                  </>
                ) : (
                  '保存'
                )}
              </Button>
            </div>
          </>
        )}

        {error && (
          <div className="mt-3 text-sm text-destructive" data-testid="todo-form-error">
            {error}
          </div>
        )}
      </form>
    </div>
  );
};
