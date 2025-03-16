import '@testing-library/jest-dom';

// Next.js環境のモック
class MockRequest {}
class MockResponse {
  static error() { return new MockResponse(); }
  static json() { return new MockResponse(); }
  static redirect() { return new MockResponse(); }
}
class MockHeaders {}

// グローバルオブジェクトの設定
global.Request = MockRequest as unknown as typeof Request;
global.Response = MockResponse as unknown as typeof Response;
global.Headers = MockHeaders as unknown as typeof Headers;

// TextEncoderのポリフィル
if (typeof global.TextEncoder === 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
  const { TextEncoder, TextDecoder } = require('util');
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
}
