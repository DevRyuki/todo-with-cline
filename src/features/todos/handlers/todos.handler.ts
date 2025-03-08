import { NextRequest, NextResponse } from 'next/server';
import { todosService } from '../services/todos.service';
import { z } from 'zod';

// バリデーションスキーマ
const todoCreateSchema = z.object({
  title: z.string().min(1, 'タイトルは必須です'),
  description: z.string().optional(),
  completed: z.boolean().optional(),
});

const todoUpdateSchema = z.object({
  title: z.string().min(1, 'タイトルは必須です').optional(),
  description: z.string().optional(),
  completed: z.boolean().optional(),
}).refine(data => Object.keys(data).length > 0, {
  message: '更新するフィールドが必要です',
});

// Todoハンドラーの実装
export const todosHandler = {
  // すべてのTodoを取得
  async getAllTodos() {
    try {
      const todos = await todosService.getAllTodos();
      return NextResponse.json(todos, { status: 200 });
    } catch (error) {
      console.error('Todos取得エラー:', error);
      return NextResponse.json({ error: 'Todosの取得に失敗しました' }, { status: 500 });
    }
  },

  // 特定のTodoを取得
  async getTodoById(id: string) {
    // IDをバリデーション
    const todoId = parseInt(id);
    if (isNaN(todoId)) {
      return NextResponse.json({ error: '無効なIDです' }, { status: 400 });
    }

    try {
      const todo = await todosService.getTodoById(todoId);

      if (!todo) {
        return NextResponse.json({ error: 'Todoが見つかりません' }, { status: 404 });
      }

      return NextResponse.json(todo, { status: 200 });
    } catch (error) {
      console.error(`Todo ID ${id} 取得エラー:`, error);
      return NextResponse.json({ error: 'Todoの取得に失敗しました' }, { status: 500 });
    }
  },

  // 新しいTodoを作成
  async createTodo(request: NextRequest) {
    try {
      const body = await request.json();

      // バリデーション
      const result = todoCreateSchema.safeParse(body);
      if (!result.success) {
        return NextResponse.json({
          error: '無効なデータです',
          details: result.error.format(),
        }, { status: 400 });
      }

      const newTodo = await todosService.createTodo(result.data);
      return NextResponse.json(newTodo, { status: 201 });
    } catch (error) {
      console.error('Todo作成エラー:', error);
      return NextResponse.json({ error: 'Todoの作成に失敗しました' }, { status: 500 });
    }
  },

  // Todoを更新
  async updateTodo(id: string, request: NextRequest) {
    // IDをバリデーション
    const todoId = parseInt(id);
    if (isNaN(todoId)) {
      return NextResponse.json({ error: '無効なIDです' }, { status: 400 });
    }

    try {
      const body = await request.json();

      // バリデーション
      const result = todoUpdateSchema.safeParse(body);
      if (!result.success) {
        return NextResponse.json({
          error: '無効なデータです',
          details: result.error.format(),
        }, { status: 400 });
      }

      const updatedTodo = await todosService.updateTodo(todoId, result.data);

      if (!updatedTodo) {
        return NextResponse.json({ error: 'Todoが見つかりません' }, { status: 404 });
      }

      return NextResponse.json(updatedTodo, { status: 200 });
    } catch (error) {
      console.error(`Todo ID ${id} 更新エラー:`, error);
      return NextResponse.json({ error: 'Todoの更新に失敗しました' }, { status: 500 });
    }
  },

  // Todoを削除
  async deleteTodo(id: string) {
    // IDをバリデーション
    const todoId = parseInt(id);
    if (isNaN(todoId)) {
      return NextResponse.json({ error: '無効なIDです' }, { status: 400 });
    }

    try {
      const success = await todosService.deleteTodo(todoId);

      if (!success) {
        return NextResponse.json({ error: 'Todoが見つかりません' }, { status: 404 });
      }

      return new NextResponse(null, { status: 204 });
    } catch (error) {
      console.error(`Todo ID ${id} 削除エラー:`, error);
      return NextResponse.json({ error: 'Todoの削除に失敗しました' }, { status: 500 });
    }
  },
};
