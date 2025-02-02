// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Knex } from 'knex'

declare module 'knex/types/tables' {
  interface Users {
    id: string
    username: string;
    session_id: string
    created_at: string
  }

  interface Meals {
    id: string
    session_id: string
    name: string
    description: string
    is_diet: boolean
    created_at: string
    updated_at: string
  }

  interface Tables {
    users: Users
    meals: Meals
  }
}