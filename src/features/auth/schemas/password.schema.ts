import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { users } from './schema';

/**
 * パスワード認証用のスキーマ
 * NextAuthのスキーマにはパスワードフィールドがないため、別テーブルで管理
 */
export const passwords = pgTable('passwords', {
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' })
    .primaryKey(),
  hash: text('hash').notNull(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).notNull().defaultNow(),
});
