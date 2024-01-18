/**
 * Datatbase client.
 */
import { DB } from '@/types/database.types'
import { Pool } from 'pg'
import { PostgresDialect } from 'kysely'
import { KyselyAuth, type Codegen } from "./adapter"
import environmentVariables from '@/config/environment'

export const dbClient=new KyselyAuth<DB, Codegen>({
    dialect: new PostgresDialect({
        pool: new Pool({
            connectionString: environmentVariables.databaseUrl
        })
    })
});