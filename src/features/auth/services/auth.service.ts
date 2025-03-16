import { db } from '@/db';
import { users, verificationTokens, passwords } from '@/features/auth/schemas/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';
import { Resend } from 'resend';
import { randomBytes } from 'crypto';

// 環境変数からResend設定を取得
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_DOMAIN = process.env.RESEND_DOMAIN;

// パスワードリセットトークンの有効期限（24時間）
const TOKEN_EXPIRY_HOURS = 24;

export interface UserRegistrationData {
  email: string;
  password: string;
  name?: string;
}

export interface UserData {
  id: string;
  email: string;
  name?: string | null;
  emailVerified?: Date | null;
  image?: string | null;
}

export interface VerificationToken {
  identifier: string;
  token: string;
  expires: Date;
}

export class AuthService {
  private resend: Resend;

  constructor() {
    if (!RESEND_API_KEY) {
      console.warn('RESEND_API_KEY is not set. Email functionality will not work.');
    }
    if (!RESEND_DOMAIN) {
      console.warn('RESEND_DOMAIN is not set. Email functionality may not work correctly.');
    }
    
    // テスト環境ではAPIキーがなくてもエラーにならないようにする
    try {
      this.resend = new Resend(RESEND_API_KEY || 'test_api_key_for_unit_tests');
    } catch (error) {
      console.error('Resend初期化エラー:', error);
      // テスト用のダミーオブジェクト
      this.resend = {
        emails: {
          send: async () => ({ id: 'test-email-id' }),
        },
      } as unknown as Resend;
    }
  }

  /**
   * ユーザー登録
   * @param userData ユーザー登録データ
   * @returns 登録されたユーザー情報
   */
  async registerUser(userData: UserRegistrationData): Promise<UserData> {
    // メールアドレスが既に存在するか確認
    const existingUser = await db.select()
      .from(users)
      .where(eq(users.email, userData.email));

    if (existingUser.length > 0) {
      throw new Error('User with this email already exists');
    }

    // パスワードのハッシュ化
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // ユーザーIDの生成
    const userId = randomBytes(16).toString('hex');

    // ユーザーの作成
    const newUser = await db.insert(users)
      .values({
        id: userId,
        email: userData.email,
        name: userData.name,
      })
      .returning();

    // パスワードの保存
    await db.insert(passwords)
      .values({
        userId: userId,
        hash: hashedPassword,
      });

    return newUser[0];
  }

  /**
   * ユーザー認証
   * @param email メールアドレス
   * @param password パスワード
   * @returns 認証されたユーザー情報、または認証失敗時はnull
   */
  async validateUser(email: string, password: string): Promise<UserData | null> {
    // ユーザーの検索
    const userResults = await db.select()
      .from(users)
      .where(eq(users.email, email));

    if (userResults.length === 0) {
      return null;
    }

    const user = userResults[0];

    // パスワードの取得
    const passwordResults = await db.select()
      .from(passwords)
      .where(eq(passwords.userId, user.id));

    if (passwordResults.length === 0) {
      return null;
    }

    // パスワードの検証
    const isPasswordValid = await bcrypt.compare(password, passwordResults[0].hash);
    if (!isPasswordValid) {
      return null;
    }

    return user;
  }

  /**
   * パスワードリセットトークンの生成
   * @param email メールアドレス
   * @returns 生成されたトークン情報
   */
  async generatePasswordResetToken(email: string): Promise<VerificationToken> {
    // ユーザーの存在確認
    const userResults = await db.select()
      .from(users)
      .where(eq(users.email, email));

    if (userResults.length === 0) {
      throw new Error('User not found');
    }

    // 既存のトークンを削除
    await db.delete(verificationTokens)
      .where(eq(verificationTokens.identifier, email));

    // 有効期限の設定（24時間後）
    const expires = new Date();
    expires.setHours(expires.getHours() + TOKEN_EXPIRY_HOURS);

    // トークンの生成
    const token = randomBytes(32).toString('hex');

    // トークンの保存
    const [verificationToken] = await db.insert(verificationTokens)
      .values({
        identifier: email,
        token,
        expires,
      })
      .returning();

    return verificationToken;
  }

  /**
   * パスワードのリセット
   * @param token リセットトークン
   * @param newPassword 新しいパスワード
   * @returns リセット成功時はtrue
   */
  async resetPassword(token: string, newPassword: string): Promise<boolean> {
    // トークンの検証
    const tokens = await db.select()
      .from(verificationTokens)
      .where(eq(verificationTokens.token, token));

    if (tokens.length === 0) {
      throw new Error('Invalid or expired token');
    }

    const verificationToken = tokens[0];
    const now = new Date();

    // トークンの有効期限チェック
    if (now > verificationToken.expires) {
      throw new Error('Invalid or expired token');
    }

    // パスワードのハッシュ化
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // ユーザーの取得
    const userResults = await db.select()
      .from(users)
      .where(eq(users.email, verificationToken.identifier));

    if (userResults.length === 0) {
      throw new Error('User not found');
    }

    // パスワードの更新
    await db.update(passwords)
      .set({ hash: hashedPassword, updatedAt: new Date() })
      .where(eq(passwords.userId, userResults[0].id));

    // 使用済みトークンの削除
    await db.delete(verificationTokens)
      .where(eq(verificationTokens.token, token));

    return true;
  }

  /**
   * パスワードリセットメールの送信
   * @param token トークン情報
   * @param userName ユーザー名
   */
  async sendPasswordResetEmail(token: VerificationToken, userName?: string): Promise<void> {
    if (!RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not set. Cannot send password reset email.');
      return;
    }

    if (!RESEND_DOMAIN) {
      console.error('RESEND_DOMAIN is not set. Cannot send password reset email.');
      return;
    }

    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${token.token}`;

    await this.resend.emails.send({
      from: `noreply@${RESEND_DOMAIN}`,
      to: token.identifier,
      subject: 'パスワードリセットのご案内',
      html: `
        <h1>パスワードリセットのご案内</h1>
        <p>${userName ? `こんにちは、${userName}さん` : 'こんにちは'}</p>
        <p>パスワードリセットのリクエストを受け付けました。以下のリンクをクリックして新しいパスワードを設定してください。</p>
        <p><a href="${resetUrl}">パスワードをリセットする</a></p>
        <p>このリンクは24時間有効です。</p>
        <p>パスワードリセットをリクエストしていない場合は、このメールを無視してください。</p>
      `,
    });
  }
}
