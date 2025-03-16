import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { db } from '@/db';
import { AuthService } from '../auth.service';
import { users, passwords } from '@/features/auth/schemas/schema';
import bcrypt from 'bcrypt';
import { Resend } from 'resend';

// モックの設定
jest.mock('@/db', () => ({
  db: {
    insert: jest.fn().mockReturnValue({
      values: jest.fn().mockReturnValue({
        returning: jest.fn(),
      }),
    }),
    select: jest.fn().mockReturnValue({
      from: jest.fn().mockReturnValue({
        where: jest.fn(),
      }),
    }),
    update: jest.fn().mockReturnValue({
      set: jest.fn().mockReturnValue({
        where: jest.fn(),
      }),
    }),
    delete: jest.fn().mockReturnValue({
      where: jest.fn(),
    }),
  },
}));

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockImplementation(() => Promise.resolve('hashed-password')),
  compare: jest.fn().mockImplementation(() => Promise.resolve(true)),
}));

jest.mock('resend', () => {
  return {
    Resend: jest.fn().mockImplementation(() => {
      return {
        emails: {
          send: jest.fn().mockResolvedValue({ id: 'email-id' }),
        },
      };
    }),
  };
});

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(() => {
    jest.clearAllMocks();
    authService = new AuthService();
  });

  describe('registerUser', () => {
    it('should hash password and create a new user', async () => {
      // モックの設定
      // bcrypt.hashはすでにモック化されているので、ここでは設定不要
      (db.insert as jest.Mock).mockReturnValue({
        values: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValue([
            { id: 'user-id', email: 'test@example.com', name: 'Test User' },
          ]),
        }),
      });

      // テスト実行
      const result = await authService.registerUser({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      });

      // 検証
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(db.insert).toHaveBeenCalledWith(users);
      expect(db.insert).toHaveBeenCalledWith(passwords);
      expect(result).toEqual({
        id: 'user-id',
        email: 'test@example.com',
        name: 'Test User',
      });
    });

    it('should throw an error if user already exists', async () => {
      // モックの設定
      (db.select as jest.Mock).mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockResolvedValue([{ id: 'existing-user-id' }]),
        }),
      });

      // テスト実行と検証
      await expect(
        authService.registerUser({
          email: 'existing@example.com',
          password: 'password123',
          name: 'Existing User',
        })
      ).rejects.toThrow('User with this email already exists');
    });
  });

  describe('validateUser', () => {
    it('should return user if credentials are valid', async () => {
      // モックの設定
      const mockUser = {
        id: 'user-id',
        email: 'test@example.com',
        name: 'Test User',
      };

      const mockPassword = {
        userId: 'user-id',
        hash: 'hashed-password',
      };

      // ユーザー検索のモック
      (db.select as jest.Mock).mockReturnValueOnce({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockResolvedValue([mockUser]),
        }),
      });

      // パスワード検索のモック
      (db.select as jest.Mock).mockReturnValueOnce({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockResolvedValue([mockPassword]),
        }),
      });

      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      // テスト実行
      const result = await authService.validateUser('test@example.com', 'password123');

      // 検証
      expect(db.select).toHaveBeenCalledTimes(2);
      expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashed-password');
      expect(result).toEqual(mockUser);
    });

    it('should return null if user not found', async () => {
      // モックの設定
      (db.select as jest.Mock).mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockResolvedValue([]),
        }),
      });

      // テスト実行
      const result = await authService.validateUser('nonexistent@example.com', 'password123');

      // 検証
      expect(result).toBeNull();
    });

    it('should return null if password is invalid', async () => {
      // モックの設定
      const mockUser = {
        id: 'user-id',
        email: 'test@example.com',
        name: 'Test User',
      };

      const mockPassword = {
        userId: 'user-id',
        hash: 'hashed-password',
      };

      // ユーザー検索のモック
      (db.select as jest.Mock).mockReturnValueOnce({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockResolvedValue([mockUser]),
        }),
      });

      // パスワード検索のモック
      (db.select as jest.Mock).mockReturnValueOnce({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockResolvedValue([mockPassword]),
        }),
      });

      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      // テスト実行
      const result = await authService.validateUser('test@example.com', 'wrong-password');

      // 検証
      expect(bcrypt.compare).toHaveBeenCalledWith('wrong-password', 'hashed-password');
      expect(result).toBeNull();
    });
  });

  describe('generatePasswordResetToken', () => {
    it('should generate a token and save it to the database', async () => {
      // モックの設定
      const mockUser = { id: 'user-id', email: 'test@example.com' };
      (db.select as jest.Mock).mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockResolvedValue([mockUser]),
        }),
      });

      (db.insert as jest.Mock).mockReturnValue({
        values: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValue([
            { identifier: 'test@example.com', token: 'reset-token', expires: expect.any(Date) },
          ]),
        }),
      });

      // テスト実行
      const result = await authService.generatePasswordResetToken('test@example.com');

      // 検証
      expect(db.select).toHaveBeenCalled();
      expect(db.insert).toHaveBeenCalled();
      expect(result).toEqual({
        identifier: 'test@example.com',
        token: 'reset-token',
        expires: expect.any(Date),
      });
    });

    it('should throw an error if user not found', async () => {
      // モックの設定
      (db.select as jest.Mock).mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockResolvedValue([]),
        }),
      });

      // テスト実行と検証
      await expect(
        authService.generatePasswordResetToken('nonexistent@example.com')
      ).rejects.toThrow('User not found');
    });
  });

  describe('resetPassword', () => {
    it('should reset password if token is valid', async () => {
      // モックの設定
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      // トークン検証のモック
      (db.select as jest.Mock).mockReturnValueOnce({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockResolvedValue([
            { identifier: 'test@example.com', token: 'valid-token', expires: tomorrow },
          ]),
        }),
      });

      // ユーザー検索のモック
      (db.select as jest.Mock).mockReturnValueOnce({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockResolvedValue([
            { id: 'user-id', email: 'test@example.com' },
          ]),
        }),
      });

      const mockHashedPassword = 'new-hashed-password';
      (bcrypt.hash as jest.Mock).mockResolvedValue(mockHashedPassword);

      (db.update as jest.Mock).mockReturnValue({
        set: jest.fn().mockReturnValue({
          where: jest.fn().mockResolvedValue([
            { userId: 'user-id', hash: mockHashedPassword },
          ]),
        }),
      });

      (db.delete as jest.Mock).mockReturnValue({
        where: jest.fn().mockResolvedValue([]),
      });

      // テスト実行
      const result = await authService.resetPassword('valid-token', 'new-password');

      // 検証
      expect(db.select).toHaveBeenCalledTimes(2);
      expect(bcrypt.hash).toHaveBeenCalledWith('new-password', 10);
      expect(db.update).toHaveBeenCalledWith(passwords);
      expect(db.delete).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('should throw an error if token is invalid', async () => {
      // モックの設定
      (db.select as jest.Mock).mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockResolvedValue([]),
        }),
      });

      // テスト実行と検証
      await expect(
        authService.resetPassword('invalid-token', 'new-password')
      ).rejects.toThrow('Invalid or expired token');
    });

    it('should throw an error if token is expired', async () => {
      // モックの設定
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      (db.select as jest.Mock).mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockResolvedValue([
            { identifier: 'test@example.com', token: 'expired-token', expires: yesterday },
          ]),
        }),
      });

      // テスト実行と検証
      await expect(
        authService.resetPassword('expired-token', 'new-password')
      ).rejects.toThrow('Invalid or expired token');
    });
  });

  describe('sendPasswordResetEmail', () => {
    it('should send a password reset email', async () => {
      // モックの設定
      const mockToken = {
        identifier: 'test@example.com',
        token: 'reset-token',
        expires: new Date(),
      };

      const mockResendInstance = new Resend('test-api-key');

      // テスト実行
      await authService.sendPasswordResetEmail(mockToken, 'Test User');

      // 検証
      expect(mockResendInstance.emails.send).toHaveBeenCalled();
    });
  });
});
