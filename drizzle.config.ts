import type { Config } from 'drizzle-kit';
import { dbConfig } from './src/db/config';

export default {
  schema: [
    './src/db/schema.ts',
    './src/features/*/schemas/schema.ts',
  ],
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: dbConfig,
} satisfies Config;
