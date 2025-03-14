import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { NextRequest, NextResponse } from 'next/server';
import { AuthHandler } from '../auth.handler';
import { AuthService } from '../../services/auth.service';

// AuthServiceのモック
jest.mock('../../services/auth.service');

describe('AuthHandler', () => {
  let authHandler: AuthHandler;
  let mockAuthService: jest.Mocked<AuthService>;

  beforeEach(() => {
    // モックのリセット
    jest.clearAllMocks();

    // AuthServiceのモックインスタンス
    mockAuthService = new AuthService() as jest.Mocked<AuthService>;

    // AuthHandlerのインスタンス化
    authHandler = new AuthHandler(mockAuthService);
  });

  describe('register', () => {
    it('should register a new user and return 201 status', async () => {
      // リクエストデータ
      const requestData = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      };

      // モックリクエスト
      const mockRequest = {
        json: jest.fn().mockResolvedValue(requestData),
      } as unknown as NextRequest;

      // AuthServiceのregisterUserメソッドのモック
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
      expect(response).toBeInstanceOf(NextResponse);
      expect(response.status).toBe(201);

      // レスポンスボディの検証
      const responseBody = await response.json();
      expect(responseBody).toEqual({
        id: 'user-id',
        email: 'test@example.com',
        name: 'Test User',
      });
    });

    it('should return 400 if request body is invalid', async () => {
      // 無効なリクエストデータ（メールアドレスなし）
      const requestData = {
        password: 'password123',
        name: 'Test User',
      };

      // モックリクエスト
      const mockRequest = {
        json: jest.fn().mockResolvedValue(requestData),
      } as unknown as NextRequest;

      // テスト実行
      const response = await authHandler.register(mockRequest);

      // 検証
      expect(mockRequest.json).toHaveBeenCalled();
      expect(mockAuthService.registerUser).not.toHaveBeenCalled();
      expect(response).toBeInstanceOf(NextResponse);
      expect(response.status).toBe(400);
    });

    it('should return 409 if user already exists', async () => {
      // リクエストデータ
      const requestData = {
        email: 'existing@example.com',
        password: 'password123',
        name: 'Existing User',
      };

      // モックリクエスト
      const mockRequest = {
        json: jest.fn().mockResolvedValue(requestData),
      } as unknown as NextRequest;

      // AuthServiceのregisterUserメソッドのモック（エラーをスロー）
      mockAuthService.registerUser.mockRejectedValue(
        new Error('User with this email already exists')
      );

      // テスト実行
      const response = await authHandler.register(mockRequest);

      // 検証
      expect(mockRequest.json).toHaveBeenCalled();
      expect(mockAuthService.registerUser).toHaveBeenCalledWith(requestData);
      expect(response).toBeInstanceOf(NextResponse);
      expect(response.status).toBe(409);
    });

    it('should return 500 for unexpected errors', async () => {
      // リクエストデータ
      const requestData = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      };

      // モックリクエスト
      const mockRequest = {
        json: jest.fn().mockResolvedValue(requestData),
      } as unknown as NextRequest;

      // AuthServiceのregisterUserメソッドのモック（予期しないエラーをスロー）
      mockAuthService.registerUser.mockRejectedValue(
        new Error('Unexpected error')
      );

      // テスト実行
      const response = await authHandler.register(mockRequest);

      // 検証
      expect(mockRequest.json).toHaveBeenCalled();
      expect(mockAuthService.registerUser).toHaveBeenCalledWith(requestData);
      expect(response).toBeInstanceOf(NextResponse);
      expect(response.status).toBe(500);
    });
  });

  describe('forgotPassword', () => {
    it('should generate reset token and send email', async () => {
      // リクエストデータ
      const requestData = {
        email: 'test@example.com',
      };

      // モックリクエスト
      const mockRequest = {
        json: jest.fn().mockResolvedValue(requestData),
      } as unknown as NextRequest;

      // モックトークン
      const mockToken = {
        identifier: 'test@example.com',
        token: 'reset-token',
        expires: new Date(),
      };

      // AuthServiceのメソッドのモック
      mockAuthService.generatePasswordResetToken.mockResolvedValue(mockToken);
      mockAuthService.sendPasswordResetEmail.mockResolvedValue();

      // テスト実行
      const response = await authHandler.forgotPassword(mockRequest);

      // 検証
      expect(mockRequest.json).toHaveBeenCalled();
      expect(mockAuthService.generatePasswordResetToken).toHaveBeenCalledWith('test@example.com');
      expect(mockAuthService.sendPasswordResetEmail).toHaveBeenCalledWith(mockToken, undefined);
      expect(response).toBeInstanceOf(NextResponse);
      expect(response.status).toBe(200);
    });

    it('should return 400 if email is missing', async () => {
      // 無効なリクエストデータ（メールアドレスなし）
      const requestData = {};

      // モックリクエスト
      const mockRequest = {
        json: jest.fn().mockResolvedValue(requestData),
      } as unknown as NextRequest;

      // テスト実行
      const response = await authHandler.forgotPassword(mockRequest);

      // 検証
      expect(mockRequest.json).toHaveBeenCalled();
      expect(mockAuthService.generatePasswordResetToken).not.toHaveBeenCalled();
      expect(response).toBeInstanceOf(NextResponse);
      expect(response.status).toBe(400);
    });

    it('should return 404 if user not found', async () => {
      // リクエストデータ
      const requestData = {
        email: 'nonexistent@example.com',
      };

      // モックリクエスト
      const mockRequest = {
        json: jest.fn().mockResolvedValue(requestData),
      } as unknown as NextRequest;

      // AuthServiceのメソッドのモック（エラーをスロー）
      mockAuthService.generatePasswordResetToken.mockRejectedValue(
        new Error('User not found')
      );

      // テスト実行
      const response = await authHandler.forgotPassword(mockRequest);

      // 検証
      expect(mockRequest.json).toHaveBeenCalled();
      expect(mockAuthService.generatePasswordResetToken).toHaveBeenCalledWith('nonexistent@example.com');
      expect(response).toBeInstanceOf(NextResponse);
      expect(response.status).toBe(404);
    });
  });

  describe('resetPassword', () => {
    it('should reset password successfully', async () => {
      // リクエストデータ
      const requestData = {
        token: 'valid-token',
        password: 'new-password',
      };

      // モックリクエスト
      const mockRequest = {
        json: jest.fn().mockResolvedValue(requestData),
      } as unknown as NextRequest;

      // AuthServiceのresetPasswordメソッドのモック
      mockAuthService.resetPassword.mockResolvedValue(true);

      // テスト実行
      const response = await authHandler.resetPassword(mockRequest);

      // 検証
      expect(mockRequest.json).toHaveBeenCalled();
      expect(mockAuthService.resetPassword).toHaveBeenCalledWith('valid-token', 'new-password');
      expect(response).toBeInstanceOf(NextResponse);
      expect(response.status).toBe(200);
    });

    it('should return 400 if token or password is missing', async () => {
      // 無効なリクエストデータ（トークンなし）
      const requestData = {
        password: 'new-password',
      };

      // モックリクエスト
      const mockRequest = {
        json: jest.fn().mockResolvedValue(requestData),
      } as unknown as NextRequest;

      // テスト実行
      const response = await authHandler.resetPassword(mockRequest);

      // 検証
      expect(mockRequest.json).toHaveBeenCalled();
      expect(mockAuthService.resetPassword).not.toHaveBeenCalled();
      expect(response).toBeInstanceOf(NextResponse);
      expect(response.status).toBe(400);
    });

    it('should return 400 if token is invalid or expired', async () => {
      // リクエストデータ
      const requestData = {
        token: 'invalid-token',
        password: 'new-password',
      };

      // モックリクエスト
      const mockRequest = {
        json: jest.fn().mockResolvedValue(requestData),
      } as unknown as NextRequest;

      // AuthServiceのresetPasswordメソッドのモック（エラーをスロー）
      mockAuthService.resetPassword.mockRejectedValue(
        new Error('Invalid or expired token')
      );

      // テスト実行
      const response = await authHandler.resetPassword(mockRequest);

      // 検証
      expect(mockRequest.json).toHaveBeenCalled();
      expect(mockAuthService.resetPassword).toHaveBeenCalledWith('invalid-token', 'new-password');
      expect(response).toBeInstanceOf(NextResponse);
      expect(response.status).toBe(400);
    });
  });
});
