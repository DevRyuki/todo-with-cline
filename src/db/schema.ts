
//
// DBのテーブルを追加したら必ずこのファイルにインポートしてください
//
import { todos } from '@/features/todos/schemas/schema';
import { projects } from '@/features/projects/schemas/schema';
import { workspaces } from '@/features/workspaces/schemas/schema';
import { users, accounts, sessions, verificationTokens, passwords } from '@/features/auth/schemas/schema';

export { todos, projects, workspaces, users, accounts, sessions, verificationTokens, passwords };


const schema = {
  todos,
  projects,
  workspaces,
  users,
  accounts,
  sessions,
  verificationTokens,
  passwords,
};

export default schema;
