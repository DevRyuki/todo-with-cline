import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { NextResponse } from 'next/server';
import { AuthHandler } from '../auth.handler';
import { AuthService } from '../../services/auth.service';
import { createMockAuthService, createMockRequest, expectJsonResponse } from '@/test/helpers';
import { DeepMockProxy } from 'jest-mock-extended';

describe('AuthHandler', () => {
  let authHandler: AuthHandler;
  let mockAuthService: DeepMockProxy<AuthService>;

  beforeEach(() => {
    // モックのリセット
    jest.clearAllMocks();

    // jest-mock-extendedを使用して型安全なモックを作成
    mockAuthService = createMockAuthService();

    // AuthHandlerのインスタンス化
    authHandler = new AuthHandler(mockAuthService);

    // NextResponse.jsonのモック
    jest.spyOn(NextResponse, 'json').mockImplementation((body, init) => {
      return {
        status: init?.status || 200,
        body,
      } as unknown as NextResponse;
    });
  });

  // 最小限のテストケース
  it('基本的なテスト: モックが正しく動作することを確認', () => {
    expect(mockAuthService).toBeDefined();
    expect(authHandler).toBeDefined();
  });

  // registerメソッドのテスト
  describe('register', () => {
    it('正常系: 有効なデータでユーザー登録が成功する', async () => {
      // リクエストデータ
      const requestData = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      };

      // モックリクエスト
      const mockRequest = createMockRequest(requestData);

      // モック設定
      mockAuthService.registerUser.mockResolvedValue({
        id: 'user-id',
        email: 'test@example.com',
        name: 'Test User',
      });

      // テスト実行
      const response = await authHandler.register(mockRequest);

      // 検証
      expect(mockRequest.json).toHaveBeenCalled();
      expect(mockAuthService.registerUser).toHaveBeenCalledWith(requestData);
      expect(response.status).toBe(201);
    });

    it('異常系: 無効なリクエストデータの場合は400エラーを返す', async () => {
      // 無効なリクエストデータ（メールアドレスなし）
      const requestData = {
        password: 'password123',
        name: 'Test User',
      };

      // モックリクエスト
      const mockRequest = createMockRequest(requestData);

      // テスト実行
      const response = await authHandler.register(mockRequest);

      // 検証
      expect(mockRequest.json).toHaveBeenCalled();
      expect(mockAuthService.registerUser).not.toHaveBeenCalled();
      expect(response.status).toBe(400);
    });
  });

  // forgotPasswordメソッドのテスト
  describe('forgotPassword', () => {
    it('正常系: パスワードリセットメールが送信される', async () => {
      // リクエストデータ
      const requestData = {
        email: 'test@example.com',
      };

      // モックリクエスト
      const mockRequest = createMockRequest(requestData);

      // モックトークン
      const mockToken = {
        identifier: 'test@example.com',
        token: 'reset-token',
        expires: new Date(),
      };

      // モック設定
      mockAuthService.generatePasswordResetToken.mockResolvedValue(mockToken);
      mockAuthService.sendPasswordResetEmail.mockResolvedValue(undefined);

      // テスト実行
      const response = await authHandler.forgotPassword(mockRequest);

      // 検証
      expect(mockRequest.json).toHaveBeenCalled();
      expect(mockAuthService.generatePasswordResetToken).toHaveBeenCalledWith('test@example.com');
      expect(mockAuthService.sendPasswordResetEmail).toHaveBeenCalledWith(mockToken);
      expect(response.status).toBe(200);
      expectJsonResponse(
        response,
        { message: 'Password reset email sent' },
        200
      );
    });
  });

  // resetPasswordメソッドのテスト
  describe('resetPassword', () => {
    it('正常系: パスワードリセットが成功する', async () => {
      // リクエストデータ
      const requestData = {
        token: 'valid-token',
        password: 'new-password',
      };

      // モックリクエスト
      const mockRequest = createMockRequest(requestData);

      // モック設定
      mockAuthService.resetPassword.mockResolvedValue(true);

      // テスト実行
      const response = await authHandler.resetPassword(mockRequest);

      // 検証
      expect(mockRequest.json).toHaveBeenCalled();
      expect(mockAuthService.resetPassword).toHaveBeenCalledWith('valid-token', 'new-password');
      expect(response.status).toBe(200);
      expectJsonResponse(
        response,
        { message: 'Password reset successful' },
        200
      );
    });
  });
});
