import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/features/auth/services/auth.service';

// テスト用の型拡張
declare global {
  namespace jest {
    // モック型の拡張
    interface Mock<T = unknown> {
      mockResolvedValue: (value: T) => this;
      mockRejectedValue: (value: unknown) => this;
    }
  }
}

// NextRequest モック用の型定義
export interface MockNextRequest extends Partial<NextRequest> {
  json: jest.Mock;
}

// NextRequest のグローバル拡張
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface Global {
      NextRequest: typeof NextRequest & {
        withBody(body: unknown): NextRequest;
      };
    }
  }
}

// NextResponse モック用の型定義
export interface MockNextResponse extends Partial<NextResponse> {
  status: number;
  json: () => Promise<unknown>;
}

// AuthService モック用の型定義
export interface MockAuthService extends Partial<AuthService> {
  registerUser: jest.Mock;
  validateUser: jest.Mock;
  generatePasswordResetToken: jest.Mock;
  resetPassword: jest.Mock;
  sendPasswordResetEmail: jest.Mock;
}
