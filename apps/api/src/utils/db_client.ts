/**
 * Datatbase client.
 */
import { DB } from '@/types/database.types'
import { Pool } from 'pg'
import { Kysely, PostgresDialect } from 'kysely'
import environmentVariables from '@/config/environment'

export const pgPool = new Pool({
  connectionString: environmentVariables.databaseUrl,
});

const dialect = new PostgresDialect({
  pool: pgPool
});

export const dbClient = new Kysely<DB>({
  dialect,
});