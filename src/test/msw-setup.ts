import { setupServer } from 'msw/node';
import { handlers } from './msw-handlers';
import { beforeAll, afterEach, afterAll } from '@jest/globals';

// MSWサーバーのセットアップ
export const server = setupServer(...handlers);

// テスト前にサーバーを起動
beforeAll(() => server.listen());

// 各テスト後にハンドラーをリセット
afterEach(() => server.resetHandlers());

// テスト後にサーバーをクローズ
afterAll(() => server.close());
