import { db } from '@/db';
import { todos } from '@/features/todos/schemas/schema';
import { eq } from 'drizzle-orm';

// Todoサービスの型定義
interface TodoInput {
  title: string;
  description?: string;
  completed?: boolean;
}

interface TodoUpdateInput {
  title?: string;
  description?: string;
  completed?: boolean;
}

// Todoサービスの実装
export const todosService = {
  // すべてのTodoを取得
  async getAllTodos() {
    return await db.select().from(todos);
  },

  // 特定のTodoを取得
  async getTodoById(id: number) {
    const result = await db.select().from(todos).where(eq(todos.id, id));
    return result.length > 0 ? result[0] : null;
  },

  // 新しいTodoを作成
  async createTodo(data: TodoInput) {
    const now = new Date();
    const result = await db.insert(todos).values({
      ...data,
      completed: data.completed ?? false,
      createdAt: now,
      updatedAt: now,
    }).returning();

    return result[0];
  },

  // Todoを更新
  async updateTodo(id: number, data: TodoUpdateInput) {
    const now = new Date();
    const result = await db.update(todos)
      .set({
        ...data,
        updatedAt: now,
      })
      .where(eq(todos.id, id))
      .returning();

    return result.length > 0 ? result[0] : null;
  },

  // Todoを削除
  async deleteTodo(id: number) {
    const result = await db.delete(todos)
      .where(eq(todos.id, id))
      .returning();

    return result.length > 0;
  },
};
