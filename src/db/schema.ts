
/**
 * データベーススキーマの集約モジュール
 * 
 * このファイルは、アプリケーション全体で使用されるすべてのデータベーススキーマを
 * 一元管理するためのものです。新しいテーブルを追加した場合は、必ずこのファイルに
 * インポートして、schemaオブジェクトに追加してください。
 */

// 各機能領域からスキーマをインポート
import { todos } from '@/features/todos/schemas/schema';
import { projects } from '@/features/projects/schemas/schema';
import { workspaces } from '@/features/workspaces/schemas/schema';
import { 
  users, 
  accounts, 
  sessions, 
  verificationTokens, 
  passwords, 
} from '@/features/auth/schemas/schema';

// 認証関連のスキーマをグループ化
export const authSchema = {
  users,
  accounts,
  sessions,
  verificationTokens,
  passwords,
};

// 機能関連のスキーマをグループ化
export const featureSchema = {
  todos,
  projects,
  workspaces,
};

// すべてのスキーマを個別にエクスポート
export { 
  todos, 
  projects, 
  workspaces, 
  users, 
  accounts, 
  sessions, 
  verificationTokens, 
  passwords, 
};

// すべてのスキーマを含む統合オブジェクト
const schema = {
  ...authSchema,
  ...featureSchema,
};

export default schema;
