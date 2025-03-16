import '@testing-library/jest-dom';
import { NextRequest as OriginalNextRequest, NextResponse as OriginalNextResponse } from 'next/server';

// Next.js環境のモック
class MockRequest {}
class MockResponse {
  static error() { return new MockResponse(); }
  static json() { return new MockResponse(); }
  static redirect() { return new MockResponse(); }
}
class MockHeaders {}

// NextRequest/NextResponseのモック
class MockNextRequest {
  json: jest.Mock;
  cookies: {
    get: jest.Mock;
    getAll: jest.Mock;
    set: jest.Mock;
    delete: jest.Mock;
    has: jest.Mock;
    clear: jest.Mock;
  };
  headers: {
    get: jest.Mock;
    has: jest.Mock;
    entries: jest.Mock;
    forEach: jest.Mock;
  };

  constructor() {
    this.json = jest.fn();
    this.cookies = {
      get: jest.fn(),
      getAll: jest.fn(),
      set: jest.fn(),
      delete: jest.fn(),
      has: jest.fn(),
      clear: jest.fn(),
    };
    this.headers = {
      get: jest.fn(),
      has: jest.fn(),
      entries: jest.fn(),
      forEach: jest.fn(),
    };
  }

  // ファクトリーメソッド - リクエストボディを直接設定するための便利なメソッド
  static withBody(body: unknown): MockNextRequest {
    const request = new MockNextRequest();
    request.json.mockResolvedValue(body);
    return request;
  }
}

class MockNextResponse {
  status: number;
  body: unknown;

  constructor(body?: unknown, init?: { status?: number }) {
    this.body = body;
    this.status = init?.status || 200;
  }

  static json(body: unknown, init?: { status?: number }) {
    return new MockNextResponse(body, init);
  }

  static redirect(url: string, init?: { status?: number }) {
    return new MockNextResponse(null, { status: init?.status || 302 });
  }

  static error() {
    return new MockNextResponse(null, { status: 500 });
  }

  async json() {
    return this.body;
  }
}

// グローバルオブジェクトの設定
global.Request = MockRequest as unknown as typeof Request;
global.Response = MockResponse as unknown as typeof Response;
global.Headers = MockHeaders as unknown as typeof Headers;

// NextRequest/NextResponseのグローバル設定
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(global as any).NextRequest = MockNextRequest as unknown as typeof OriginalNextRequest;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(global as any).NextResponse = MockNextResponse as unknown as typeof OriginalNextResponse;

// TextEncoderのポリフィル
if (typeof global.TextEncoder === 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
  const { TextEncoder, TextDecoder } = require('util');
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
}
