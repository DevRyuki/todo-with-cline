/**
 * Todo型の定義
 */
export interface Todo {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Todo作成時の入力型
 */
export interface TodoInput {
  title: string;
  description?: string;
  completed?: boolean;
}

/**
 * Todo更新時の入力型
 */
export interface TodoUpdateInput {
  title?: string;
  description?: string;
  completed?: boolean;
}
