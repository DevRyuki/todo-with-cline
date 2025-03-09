import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '../services/auth.service';
import { z } from 'zod';

// バリデーションスキーマ
const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().optional(),
});

const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

const resetPasswordSchema = z.object({
  token: z.string(),
  password: z.string().min(8),
});

export class AuthHandler {
  private authService: AuthService;

  constructor(authService?: AuthService) {
    this.authService = authService || new AuthService();
  }

  /**
   * ユーザー登録ハンドラー
   * @param req リクエスト
   * @returns レスポンス
   */
  async register(req: NextRequest): Promise<NextResponse> {
    try {
      // リクエストボディの取得
      const body = await req.json();

      // バリデーション
      const result = registerSchema.safeParse(body);
      if (!result.success) {
        return NextResponse.json(
          { error: 'Invalid request body', details: result.error.format() },
          { status: 400 }
        );
      }

      // ユーザー登録
      const user = await this.authService.registerUser(result.data);

      // 成功レスポンス
      return NextResponse.json(user, { status: 201 });
    } catch (error) {
      // エラーハンドリング
      if (error instanceof Error) {
        if (error.message === 'User with this email already exists') {
          return NextResponse.json(
            { error: 'User with this email already exists' },
            { status: 409 }
          );
        }
      }

      // 予期しないエラー
      console.error('Registration error:', error);
      return NextResponse.json(
        { error: 'An unexpected error occurred' },
        { status: 500 }
      );
    }
  }

  /**
   * パスワードリセットリクエストハンドラー
   * @param req リクエスト
   * @returns レスポンス
   */
  async forgotPassword(req: NextRequest): Promise<NextResponse> {
    try {
      // リクエストボディの取得
      const body = await req.json();

      // バリデーション
      const result = forgotPasswordSchema.safeParse(body);
      if (!result.success) {
        return NextResponse.json(
          { error: 'Invalid request body', details: result.error.format() },
          { status: 400 }
        );
      }

      // パスワードリセットトークンの生成
      const token = await this.authService.generatePasswordResetToken(result.data.email);

      // リセットメールの送信
      await this.authService.sendPasswordResetEmail(token);

      // 成功レスポンス
      return NextResponse.json(
        { message: 'Password reset email sent' },
        { status: 200 }
      );
    } catch (error) {
      // エラーハンドリング
      if (error instanceof Error) {
        if (error.message === 'User not found') {
          return NextResponse.json(
            { error: 'User not found' },
            { status: 404 }
          );
        }
      }

      // 予期しないエラー
      console.error('Forgot password error:', error);
      return NextResponse.json(
        { error: 'An unexpected error occurred' },
        { status: 500 }
      );
    }
  }

  /**
   * パスワードリセットハンドラー
   * @param req リクエスト
   * @returns レスポンス
   */
  async resetPassword(req: NextRequest): Promise<NextResponse> {
    try {
      // リクエストボディの取得
      const body = await req.json();

      // バリデーション
      const result = resetPasswordSchema.safeParse(body);
      if (!result.success) {
        return NextResponse.json(
          { error: 'Invalid request body', details: result.error.format() },
          { status: 400 }
        );
      }

      // パスワードのリセット
      await this.authService.resetPassword(result.data.token, result.data.password);

      // 成功レスポンス
      return NextResponse.json(
        { message: 'Password reset successful' },
        { status: 200 }
      );
    } catch (error) {
      // エラーハンドリング
      if (error instanceof Error) {
        if (error.message === 'Invalid or expired token') {
          return NextResponse.json(
            { error: 'Invalid or expired token' },
            { status: 400 }
          );
        }
      }

      // 予期しないエラー
      console.error('Reset password error:', error);
      return NextResponse.json(
        { error: 'An unexpected error occurred' },
        { status: 500 }
      );
    }
  }
}
