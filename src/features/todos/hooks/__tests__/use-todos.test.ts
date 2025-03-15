import { renderHook, act, waitFor } from '@testing-library/react';
import { useTodos } from '../use-todos';
import { todosFetcher } from '../../fetchers/todos.fetcher';

// todosFetcherのモック
jest.mock('../../fetchers/todos.fetcher', () => ({
  todosFetcher: {
    getAllTodos: jest.fn(),
    getTodoById: jest.fn(),
    createTodo: jest.fn(),
    updateTodo: jest.fn(),
    deleteTodo: jest.fn(),
    toggleTodoCompletion: jest.fn(),
  },
}));

describe('useTodos', () => {
  const mockTodos = [
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

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('初期Todoがある場合、それを使用する', () => {
    const { result } = renderHook(() => useTodos({ initialTodos: mockTodos }));
    expect(result.current.todos).toEqual(mockTodos);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('autoFetch=trueの場合、マウント時にTodoを取得する', async () => {
    (todosFetcher.getAllTodos as jest.Mock).mockResolvedValue(mockTodos);
    const { result } = renderHook(() => useTodos());
    
    expect(result.current.isLoading).toBe(true);
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    
    expect(todosFetcher.getAllTodos).toHaveBeenCalledTimes(1);
    expect(result.current.todos).toEqual(mockTodos);
  });

  it('autoFetch=falseの場合、マウント時にTodoを取得しない', () => {
    renderHook(() => useTodos({ autoFetch: false }));
    expect(todosFetcher.getAllTodos).not.toHaveBeenCalled();
  });

  it('fetchTodosが正常に動作する', async () => {
    (todosFetcher.getAllTodos as jest.Mock).mockResolvedValue(mockTodos);
    const { result } = renderHook(() => useTodos({ autoFetch: false }));
    
    expect(result.current.todos).toEqual([]);
    
    act(() => {
      void result.current.fetchTodos();
    });
    
    expect(result.current.isLoading).toBe(true);
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    
    expect(result.current.todos).toEqual(mockTodos);
    expect(result.current.error).toBeNull();
  });

  it('fetchTodosがエラーを適切に処理する', async () => {
    const errorMessage = 'APIエラー';
    (todosFetcher.getAllTodos as jest.Mock).mockRejectedValue(new Error(errorMessage));
    
    const { result } = renderHook(() => useTodos({ autoFetch: false }));
    
    act(() => {
      void result.current.fetchTodos();
    });
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    
    expect(result.current.error).toBe(errorMessage);
    expect(result.current.todos).toEqual([]);
  });

  it('createTodoが正常に動作する', async () => {
    const newTodo = {
      id: 3,
      title: '新しいTodo',
      description: '新しい説明',
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    (todosFetcher.createTodo as jest.Mock).mockResolvedValue(newTodo);
    
    const { result } = renderHook(() => useTodos({ initialTodos: mockTodos }));
    
    act(() => {
      void result.current.createTodo({ title: '新しいTodo', description: '新しい説明' });
    });
    
    await waitFor(() => {
      expect(result.current.todos).toHaveLength(3);
    });
    
    expect(todosFetcher.createTodo).toHaveBeenCalledWith({
      title: '新しいTodo',
      description: '新しい説明',
    });
    expect(result.current.todos).toEqual([...mockTodos, newTodo]);
  });

  it('updateTodoが正常に動作する', async () => {
    const updatedTodo = { ...mockTodos[0], title: '更新されたTodo', completed: true };
    (todosFetcher.updateTodo as jest.Mock).mockResolvedValue(updatedTodo);
    
    const { result } = renderHook(() => useTodos({ initialTodos: mockTodos }));
    
    act(() => {
      void result.current.updateTodo(1, { title: '更新されたTodo', completed: true });
    });
    
    await waitFor(() => {
      expect(result.current.todos[0].title).toBe('更新されたTodo');
    });
    
    expect(todosFetcher.updateTodo).toHaveBeenCalledWith(1, {
      title: '更新されたTodo',
      completed: true,
    });
    expect(result.current.todos[0]).toEqual(updatedTodo);
    expect(result.current.todos[1]).toEqual(mockTodos[1]);
  });

  it('deleteTodoが正常に動作する', async () => {
    (todosFetcher.deleteTodo as jest.Mock).mockResolvedValue(true);
    
    const { result } = renderHook(() => useTodos({ initialTodos: mockTodos }));
    
    act(() => {
      void result.current.deleteTodo(1);
    });
    
    await waitFor(() => {
      expect(result.current.todos).toHaveLength(1);
    });
    
    expect(todosFetcher.deleteTodo).toHaveBeenCalledWith(1);
    expect(result.current.todos).toEqual([mockTodos[1]]);
  });

  it('toggleTodoCompletionが正常に動作する', async () => {
    const updatedTodo = { ...mockTodos[0], completed: true };
    (todosFetcher.updateTodo as jest.Mock).mockResolvedValue(updatedTodo);
    
    const { result } = renderHook(() => useTodos({ initialTodos: mockTodos }));
    
    act(() => {
      void result.current.toggleTodoCompletion(1, true);
    });
    
    await waitFor(() => {
      expect(result.current.todos[0].completed).toBe(true);
    });
    
    expect(todosFetcher.updateTodo).toHaveBeenCalledWith(1, { completed: true });
  });
});
