import { knex as knexSetup, Knex } from 'knex'
import { env } from './env'

export const databaseConfig: Knex.Config = ({
  client: env.DATABASE_CLIENT,
  connection: {
    filename: env.DATABASE_URL,
  },
  useNullAsDefault: true,
  migrations: {
    extension: 'ts',
    directory: './database/migrations',
  },
})

export const knex = knexSetup(databaseConfig)