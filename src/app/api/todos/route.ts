import { NextRequest } from 'next/server';
import { todosHandler } from '@/features/todos/handlers/todos.handler';

// GET /api/todos - すべてのTodoを取得
export async function GET() {
  return todosHandler.getAllTodos();
}

// POST /api/todos - 新しいTodoを作成
export async function POST(request: NextRequest) {
  return todosHandler.createTodo(request);
}
