// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Knex } from 'knex'

declare module 'knex/types/tables' {
  interface Users {
    id: string
    username: string;
    create_at: string
  }

  interface Tables {
    users: Users
  }
}