import { config } from 'dotenv'
import zod from 'zod'

if (process.env.NODE_ENV === 'test') {
  config({
    path: '.env.test',
  })
} else {
  config()
}

const createEnvScheme = zod.object({
  NODE_ENV: zod.enum(['production', 'test', 'development']).default('production'),
  PORT: zod.coerce.number().default(3333),
  DATABASE_URL: zod.string(),
  DATABASE_CLIENT: zod.enum(['sqlite3', 'pg']),
})

const _env = createEnvScheme.safeParse(process.env)

if (_env.success === false) {
  console.error('Invalid environment variables', _env.error.format())

  throw new Error('Invalid environment variables')
}

export const env = _env.data