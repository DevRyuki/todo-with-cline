import { TodoList } from '@/features/todos/components/todo-list';

export default function Home() {
  return (
    <div className="min-h-screen p-8 font-[family-name:var(--font-geist-sans)]">
      <header className="mb-8">
        <h1 className="text-2xl font-bold">Todoアプリ</h1>
        <p className="text-gray-600">シンプルで使いやすいTodoリスト</p>
      </header>
      
      <main className="max-w-2xl mx-auto">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Todoリスト</h2>
          <TodoList />
        </div>
      </main>
    </div>
  );
}
