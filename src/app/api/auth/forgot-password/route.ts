import { NextRequest } from 'next/server';
import { AuthHandler } from '@/features/auth/handlers/auth.handler';

const authHandler = new AuthHandler();

/**
 * パスワードリセットリクエストAPI
 * @param req リクエスト
 * @returns レスポンス
 */
export async function POST(req: NextRequest) {
  return authHandler.forgotPassword(req);
}
