import { http, HttpResponse } from 'msw';
import { Todo, TodoInput } from '@/features/todos/types';

// モックデータ
const mockTodos: Todo[] = [
  {
    id: 1,
    title: 'テストTodo 1',
    description: '説明1',
    completed: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    title: 'テストTodo 2',
    description: '説明2',
    completed: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// MSWハンドラー
export const handlers = [
  // GET /api/todos - すべてのTodoを取得
  http.get('/api/todos', () => {
    return HttpResponse.json(mockTodos);
  }),

  // GET /api/todos/:id - 特定のTodoを取得
  http.get('/api/todos/:id', ({ params }) => {
    const id = Number(params.id);
    const todo = mockTodos.find(todo => todo.id === id);

    if (!todo) {
      return new HttpResponse(
        JSON.stringify({ error: 'Todoが見つかりません' }),
        { status: 404 }
      );
    }

    return HttpResponse.json(todo);
  }),

  // POST /api/todos - 新しいTodoを作成
  http.post('/api/todos', async ({ request }) => {
    const todoInput = await request.json() as TodoInput;
    
    // バリデーション
    if (!todoInput.title) {
      return new HttpResponse(
        JSON.stringify({ error: 'タイトルは必須です' }),
        { status: 400 }
      );
    }

    const newTodo: Todo = {
      id: mockTodos.length + 1,
      title: todoInput.title,
      description: todoInput.description || '',
      completed: todoInput.completed || false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return HttpResponse.json(newTodo, { status: 201 });
  }),

  // PATCH /api/todos/:id - Todoを更新
  http.patch('/api/todos/:id', async ({ params, request }) => {
    const id = Number(params.id);
    const todoUpdate = await request.json() as Partial<Todo>;
    const todo = mockTodos.find(todo => todo.id === id);

    if (!todo) {
      return new HttpResponse(
        JSON.stringify({ error: 'Todoが見つかりません' }),
        { status: 404 }
      );
    }

    const updatedTodo = {
      ...todo,
      ...todoUpdate,
      updatedAt: new Date(),
    };

    return HttpResponse.json(updatedTodo);
  }),

  // DELETE /api/todos/:id - Todoを削除
  http.delete('/api/todos/:id', ({ params }) => {
    const id = Number(params.id);
    const todoIndex = mockTodos.findIndex(todo => todo.id === id);

    if (todoIndex === -1) {
      return new HttpResponse(
        JSON.stringify({ error: 'Todoが見つかりません' }),
        { status: 404 }
      );
    }

    return new HttpResponse(null, { status: 204 });
  }),
];
