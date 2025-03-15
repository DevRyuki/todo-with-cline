import { Todo, TodoInput, TodoUpdateInput } from '../types';

/**
 * Todo APIとの通信を行うフェッチャー
 */
export const todosFetcher = {
  /**
   * すべてのTodoを取得
   * @returns Todoの配列
   */
  async getAllTodos(): Promise<Todo[]> {
    const response = await fetch('/api/todos');
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || `Todoの取得に失敗しました (${response.status})`
      );
    }
    return response.json();
  },

  /**
   * 特定のTodoを取得
   * @param id Todo ID
   * @returns 取得したTodo
   */
  async getTodoById(id: number): Promise<Todo> {
    const response = await fetch(`/api/todos/${id}`);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || `Todo ID ${id} の取得に失敗しました (${response.status})`
      );
    }
    return response.json();
  },

  /**
   * 新しいTodoを作成
   * @param data 作成するTodoのデータ
   * @returns 作成されたTodo
   */
  async createTodo(data: TodoInput): Promise<Todo> {
    const response = await fetch('/api/todos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || `Todoの作成に失敗しました (${response.status})`
      );
    }
    return response.json();
  },

  /**
   * Todoを更新
   * @param id 更新するTodo ID
   * @param data 更新データ
   * @returns 更新されたTodo
   */
  async updateTodo(id: number, data: TodoUpdateInput): Promise<Todo> {
    const response = await fetch(`/api/todos/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || `Todo ID ${id} の更新に失敗しました (${response.status})`
      );
    }
    return response.json();
  },

  /**
   * Todoを削除
   * @param id 削除するTodo ID
   * @returns 削除が成功したかどうか
   */
  async deleteTodo(id: number): Promise<boolean> {
    const response = await fetch(`/api/todos/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || `Todo ID ${id} の削除に失敗しました (${response.status})`
      );
    }
    return true;
  },

  /**
   * Todo完了状態の切り替え
   * @param id Todo ID
   * @param completed 新しい完了状態
   * @returns 更新されたTodo
   */
  async toggleTodoCompletion(id: number, completed: boolean): Promise<Todo> {
    return this.updateTodo(id, { completed });
  },
};
