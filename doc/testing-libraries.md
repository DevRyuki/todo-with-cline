# テストライブラリの評価

## モックライブラリの導入と活用

### 1. MSW (Mock Service Worker)

#### 概要
MSWは、ブラウザとNode.jsの両方で動作するAPIモッキングライブラリです。ネットワークレベルでリクエストをインターセプトし、モックレスポンスを返します。

#### 利点
- **宣言的なAPI定義**: REST/GraphQLのAPIをシンプルに定義できる
- **ブラウザとNode.js両方で動作**: 同じモック定義をテストとブラウザで使用可能
- **実際のネットワークリクエストをシミュレート**: より実際の使用状況に近いテストが可能
- **開発時のモックサーバーとしても使用可能**: バックエンドが未実装でも開発を進められる
- **型安全**: TypeScriptとの相性が良い

#### 使用例
```typescript
// src/test/msw-handlers.ts
import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('/api/todos', () => {
    return HttpResponse.json([
      { id: 1, title: 'テストTodo', completed: false }
    ]);
  }),
  
  http.post('/api/todos', async ({ request }) => {
    const data = await request.json();
    return HttpResponse.json({ id: 2, ...data }, { status: 201 });
  })
];

// src/test/msw-setup.ts
import { setupServer } from 'msw/node';
import { handlers } from './msw-handlers';

export const server = setupServer(...handlers);

// テスト前にサーバーを起動
beforeAll(() => server.listen());
// 各テスト後にハンドラーをリセット
afterEach(() => server.resetHandlers());
// テスト後にサーバーをクローズ
afterAll(() => server.close());

// src/features/todos/fetchers/__tests__/todos.fetcher-with-msw.test.ts
import { todosFetcher } from '../todos.fetcher';
import { server } from '@/test/msw-setup';
import { http, HttpResponse } from 'msw';

describe('todosFetcher with MSW', () => {
  it('正常にTodoリストを取得する', async () => {
    const todos = await todosFetcher.getAllTodos();
    expect(todos.length).toBeGreaterThan(0);
  });

  it('APIエラー時に例外をスローする', async () => {
    // 一時的にエラーを返すハンドラーを追加
    server.use(
      http.get('/api/todos', () => {
        return new HttpResponse(
          JSON.stringify({ error: 'APIエラー' }),
          { status: 500 }
        );
      })
    );

    await expect(todosFetcher.getAllTodos()).rejects.toThrow('APIエラー');
  });
});
```

#### 現状での必要性
**必要あり**。フェッチャーのテストにおいて、グローバルのfetch関数をモックする代わりに、MSWを使用することで、より宣言的かつ保守しやすいテストが可能になります。また、開発時のモックサーバーとしても使用できるため、バックエンドが未実装でもフロントエンド開発を進められます。

### 2. next-test-api-route-handler

#### 概要
next-test-api-route-handlerは、Next.jsのAPIルートをテストするためのユーティリティライブラリです。実際のHTTPリクエストをシミュレートし、APIルートの動作をテストできます。

#### 利点
- **APIルートの簡単なテスト**: Next.jsのAPIルートを直接テストできる
- **リクエスト/レスポンスのシミュレーション**: 実際のHTTPリクエストに近い形でテスト可能
- **セッション/クッキーのサポート**: 認証が必要なAPIルートもテスト可能

#### 課題
- **App Routerとの互換性**: 現在のNext.jsのApp Routerとの互換性に問題がある可能性があります
- **型定義の問題**: TypeScriptの型エラーが発生する場合があります

#### 代替アプローチ
App Routerを使用している場合、APIルートを直接呼び出す方法が簡単です：

```typescript
// src/features/todos/handlers/__tests__/todos-api-route.test.ts
import { NextRequest } from 'next/server';
import { GET, POST } from '@/app/api/todos/route';
import { todosService } from '../../services/todos.service';

jest.mock('../../services/todos.service', () => ({
  todosService: {
    getAllTodos: jest.fn(),
    createTodo: jest.fn(),
  },
}));

describe('Todos API Routes', () => {
  it('すべてのTodoを取得して200レスポンスを返すこと', async () => {
    (todosService.getAllTodos as jest.Mock).mockResolvedValue([/* モックデータ */]);
    
    const response = await GET();
    expect(response.status).toBe(200);
    
    const responseBody = await response.json();
    expect(responseBody).toEqual([/* モックデータ */]);
  });

  it('新しいTodoを作成して201レスポンスを返すこと', async () => {
    const newTodo = { title: '新しいTodo' };
    (todosService.createTodo as jest.Mock).mockResolvedValue({ id: 1, ...newTodo });
    
    const request = new NextRequest('http://localhost:3000/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTodo),
    });
    
    const response = await POST(request);
    expect(response.status).toBe(201);
  });
});
```

#### 現状での必要性
**必要なし**。App Routerを使用している場合、APIルートを直接呼び出す方法が簡単で効果的です。next-test-api-route-handlerは、Pages Routerを使用している場合に有用ですが、App Routerとの互換性に問題がある可能性があります。

## 結論と推奨事項

### MSW
- **推奨**: 導入を継続
- **理由**: フェッチャーのテストにおいて、より宣言的かつ保守しやすいテストが可能になります。また、開発時のモックサーバーとしても使用できるため、バックエンドが未実装でもフロントエンド開発を進められます。

### next-test-api-route-handler
- **推奨**: 削除を検討
- **理由**: App Routerを使用している場合、APIルートを直接呼び出す方法が簡単で効果的です。このライブラリは、Pages Routerを使用している場合に有用ですが、App Routerとの互換性に問題がある可能性があります。

## 実装例

### MSWの使用例
- `src/test/msw-handlers.ts`: APIエンドポイントのモック定義
- `src/test/msw-setup.ts`: MSWサーバーのセットアップ
- `src/features/todos/fetchers/__tests__/todos.fetcher-with-msw.test.ts`: MSWを使用したフェッチャーのテスト

### App RouterのAPIルートテスト例
- `src/features/todos/handlers/__tests__/todos-api-route-with-handler.test.ts`: App RouterのAPIルートを直接呼び出すテスト
