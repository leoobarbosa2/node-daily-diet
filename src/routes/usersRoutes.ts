import { FastifyInstance } from 'fastify'
import zod from 'zod'
import { knex } from '../database'
import crypto from 'node:crypto'
import { checkUserExists } from '../middlewares/checkUserExists'

export async function userRoutes(app: FastifyInstance) {
  app.post('/', {
    preHandler: [checkUserExists],
  }, async (request, reply) => {
    const createUserScheme = zod.object({
      username: zod.string(),
    })

    const { username } = createUserScheme.parse(request.body)

    await knex('users').insert({
      id: crypto.randomUUID(),
      username,
    })

    reply.status(201).send()
  })
}