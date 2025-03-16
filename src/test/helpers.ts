import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/features/auth/services/auth.service';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';

/**
 * 型安全なAuthServiceモックを作成するヘルパー関数
 * @returns AuthServiceのDeepMockProxy
 */
export function createMockAuthService(): DeepMockProxy<AuthService> {
  return mockDeep<AuthService>();
}

/**
 * モックNextRequestを作成するヘルパー関数
 * @param body リクエストボディ
 * @returns モック化されたNextRequest
 */
export function createMockRequest(body: unknown): NextRequest {
  return {
    json: jest.fn().mockResolvedValue(body),
    cookies: {
      get: jest.fn(),
      getAll: jest.fn(),
      set: jest.fn(),
      delete: jest.fn(),
      has: jest.fn(),
      clear: jest.fn(),
    },
    headers: {
      get: jest.fn(),
      has: jest.fn(),
      entries: jest.fn(),
      forEach: jest.fn(),
    } as unknown as Headers,
  } as unknown as NextRequest;
}

/**
 * NextResponse.jsonの呼び出しを検証するヘルパー関数
 * @param response テスト対象の関数から返されたレスポンス
 * @param expectedBody 期待されるレスポンスボディ
 * @param expectedStatus 期待されるステータスコード
 */
export function expectJsonResponse(
  response: NextResponse,
  expectedBody: unknown,
  expectedStatus: number
): void {
  expect(response.status).toBe(expectedStatus);
  expect(NextResponse.json).toHaveBeenCalledWith(
    expectedBody,
    { status: expectedStatus }
  );
}
