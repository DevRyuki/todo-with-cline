import '@testing-library/jest-dom';

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
  url: string;
  method: string;
  json: jest.Mock;
  text: jest.Mock;
  blob: jest.Mock;
  arrayBuffer: jest.Mock;
  formData: jest.Mock;
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
    append: jest.Mock;
    delete: jest.Mock;
    set: jest.Mock;
    getSetCookie: jest.Mock;
  };
  nextUrl: {
    pathname: string;
    search: string;
    searchParams: URLSearchParams;
    hash: string;
    href: string;
    origin: string;
    protocol: string;
    hostname: string;
    port: string;
  };

  constructor(url = 'http://localhost:3000', method = 'GET') {
    this.url = url;
    this.method = method;
    this.json = jest.fn().mockResolvedValue({});
    this.text = jest.fn().mockResolvedValue('');
    this.blob = jest.fn().mockResolvedValue(new Blob());
    this.arrayBuffer = jest.fn().mockResolvedValue(new ArrayBuffer(0));
    this.formData = jest.fn().mockResolvedValue(new FormData());
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
      append: jest.fn(),
      delete: jest.fn(),
      set: jest.fn(),
      getSetCookie: jest.fn(),
    };
    this.nextUrl = {
      pathname: '/',
      search: '',
      searchParams: new URLSearchParams(),
      hash: '',
      href: url,
      origin: 'http://localhost:3000',
      protocol: 'http:',
      hostname: 'localhost',
      port: '3000',
    };
  }

  // ファクトリーメソッド - リクエストボディを直接設定するための便利なメソッド
  static withBody(body: unknown): MockNextRequest {
    const request = new MockNextRequest();
    request.json.mockResolvedValue(body);
    return request;
  }

  // ファクトリーメソッド - URLとメソッドを指定するための便利なメソッド
  static withUrlAndMethod(url: string, method: string): MockNextRequest {
    return new MockNextRequest(url, method);
  }
}

class MockNextResponse {
  status: number;
  statusText: string;
  body: unknown;
  headers: Headers;
  cookies: {
    get: jest.Mock;
    getAll: jest.Mock;
    set: jest.Mock;
    delete: jest.Mock;
  };

  constructor(body?: unknown, init?: { status?: number; statusText?: string; headers?: Headers }) {
    this.body = body;
    this.status = init?.status || 200;
    this.statusText = init?.statusText || 'OK';
    this.headers = init?.headers || new Headers();
    this.cookies = {
      get: jest.fn(),
      getAll: jest.fn(),
      set: jest.fn(),
      delete: jest.fn(),
    };
  }

  static json(body: unknown, init?: { status?: number; headers?: Headers }) {
    return new MockNextResponse(body, init);
  }

  static redirect(url: string, init?: { status?: number }) {
    return new MockNextResponse(null, { status: init?.status || 302 });
  }

  static error() {
    return new MockNextResponse(null, { status: 500, statusText: 'Internal Server Error' });
  }

  static next(init?: { status?: number; headers?: Headers }) {
    return new MockNextResponse(null, init);
  }

  async json() {
    return this.body;
  }

  async text() {
    return JSON.stringify(this.body);
  }

  async blob() {
    return new Blob([JSON.stringify(this.body)]);
  }

  async arrayBuffer() {
    const text = JSON.stringify(this.body);
    const buffer = new ArrayBuffer(text.length);
    const view = new Uint8Array(buffer);
    for (let i = 0; i < text.length; i++) {
      view[i] = text.charCodeAt(i);
    }
    return buffer;
  }
}

// グローバルオブジェクトの設定
global.Request = MockRequest as unknown as typeof Request;
global.Response = MockResponse as unknown as typeof Response;
global.Headers = MockHeaders as unknown as typeof Headers;

// NextRequest/NextResponseのグローバル設定
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(global as any).NextRequest = MockNextRequest;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(global as any).NextResponse = MockNextResponse;

// モジュールのモック
jest.mock('next/server', () => ({
  ...jest.requireActual('next/server'),
  NextRequest: MockNextRequest,
  NextResponse: MockNextResponse,
}));

// TextEncoderのポリフィル
if (typeof global.TextEncoder === 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
  const { TextEncoder, TextDecoder } = require('util');
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
}
