
// 
// DBのテーブルを追加したら必ずこのファイルにインポートしてください
// 
import {todos} from '@/features/todos/schemas/schema';
import {projects} from '@/features/projects/schemas/schema';
import {workspaces} from '@/features/workspaces/schemas/schema';

export {todos, projects, workspaces};


const schema = {
  todos,
  projects,
  workspaces
};

export default schema;
