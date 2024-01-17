/**
 * Datatbase client.
 */
import { DB } from '@/types/database.types'
import { Pool } from 'pg'
import { PostgresDialect } from 'kysely'
import { KyselyAuth, type Codegen } from "@auth/kysely-adapter"
import environmentVariables from '@/config/environment'

export const pgPool=new Pool({
    connectionString: environmentVariables.databaseUrl,
});

const dialect=new PostgresDialect({
    pool: pgPool
});

export const dbClient=new KyselyAuth<DB, Codegen>({
    dialect,
});