import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

// Todoテーブルの定義
export const workspaces = pgTable('workspaces', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});
