import { NextRequest } from 'next/server';
import { todosHandler } from '@/features/todos/handler/todos.handler';

// GET /api/todos/[id] - 特定のTodoを取得
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return todosHandler.getTodoById(params.id);
}

// PATCH /api/todos/[id] - 特定のTodoを更新
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return todosHandler.updateTodo(params.id, request);
}

// DELETE /api/todos/[id] - 特定のTodoを削除
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return todosHandler.deleteTodo(params.id);
}
