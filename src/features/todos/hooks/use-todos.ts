'use client';

import { useState, useEffect, useCallback } from 'react';
import { todosFetcher } from '../fetchers/todos.fetcher';
import { Todo, TodoInput, TodoUpdateInput } from '../types';

interface UseTodosOptions {
  initialTodos?: Todo[];
  autoFetch?: boolean;
}

interface UseTodosResult {
  todos: Todo[];
  isLoading: boolean;
  error: string | null;
  fetchTodos: () => Promise<Todo[]>;
  getTodoById: (id: number) => Promise<Todo | null>;
  createTodo: (data: TodoInput) => Promise<Todo | null>;
  updateTodo: (id: number, data: TodoUpdateInput) => Promise<Todo | null>;
  deleteTodo: (id: number) => Promise<boolean>;
  toggleTodoCompletion: (id: number, completed: boolean) => Promise<Todo | null>;
}

/**
 * Todoデータを管理するカスタムフック
 *
 * @param options フックのオプション
 * @param options.initialTodos 初期表示するTodoリスト（オプション）
 * @param options.autoFetch 自動的にTodoを取得するかどうか（デフォルト: true）
 * @returns Todoデータと操作関数
 */
export const useTodos = (options: UseTodosOptions = {}): UseTodosResult => {
  const { initialTodos, autoFetch = true } = options;

  const [todos, setTodos] = useState<Todo[]>(initialTodos || []);
  const [isLoading, setIsLoading] = useState(!initialTodos && autoFetch);
  const [error, setError] = useState<string | null>(null);

  // Todoリストを取得
  const fetchTodos = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await todosFetcher.getAllTodos();
      setTodos(data);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '予期しないエラーが発生しました';
      setError(errorMessage);
      console.error('Todoの取得エラー:', err);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 特定のTodoを取得
  const getTodoById = useCallback(async (id: number): Promise<Todo | null> => {
    try {
      return await todosFetcher.getTodoById(id);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '予期しないエラーが発生しました';
      setError(errorMessage);
      console.error(`Todo ID ${id} の取得エラー:`, err);
      return null;
    }
  }, []);

  // 新しいTodoを作成
  const createTodo = useCallback(async (data: TodoInput): Promise<Todo | null> => {
    try {
      const newTodo = await todosFetcher.createTodo(data);
      setTodos(prevTodos => [...prevTodos, newTodo]);
      return newTodo;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '予期しないエラーが発生しました';
      setError(errorMessage);
      console.error('Todoの作成エラー:', err);
      return null;
    }
  }, []);

  // Todoを更新
  const updateTodo = useCallback(async (id: number, data: TodoUpdateInput): Promise<Todo | null> => {
    try {
      const updatedTodo = await todosFetcher.updateTodo(id, data);
      setTodos(prevTodos =>
        prevTodos.map(todo => todo.id === id ? updatedTodo : todo)
      );
      return updatedTodo;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '予期しないエラーが発生しました';
      setError(errorMessage);
      console.error(`Todo ID ${id} の更新エラー:`, err);
      return null;
    }
  }, []);

  // Todoを削除
  const deleteTodo = useCallback(async (id: number): Promise<boolean> => {
    try {
      const success = await todosFetcher.deleteTodo(id);
      if (success) {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
      }
      return success;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '予期しないエラーが発生しました';
      setError(errorMessage);
      console.error(`Todo ID ${id} の削除エラー:`, err);
      return false;
    }
  }, []);

  // Todo完了状態の切り替え
  const toggleTodoCompletion = useCallback(async (id: number, completed: boolean): Promise<Todo | null> => {
    return updateTodo(id, { completed });
  }, [updateTodo]);

  // 初期ロード
  useEffect(() => {
    if (autoFetch && !initialTodos) {
      fetchTodos();
    }
  }, [autoFetch, initialTodos, fetchTodos]);

  return {
    todos,
    isLoading,
    error,
    fetchTodos,
    getTodoById,
    createTodo,
    updateTodo,
    deleteTodo,
    toggleTodoCompletion,
  };
};
