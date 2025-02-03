import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import crypto from 'node:crypto'
import { checkUserExists } from '../middlewares/checkUserExists'
import { createUserScheme } from '../schemes/users'

export async function userRoutes(app: FastifyInstance) {
  app.post('/', {
    preHandler: [checkUserExists],
  }, async (request, reply) => {
    const { username } = createUserScheme.parse(request.body)

    let session_id = request.cookies.session_id

    if(!session_id) {
      session_id = crypto.randomUUID()

      reply.cookie('session_id', crypto.randomUUID(), {
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days,
      })
    }

    await knex('users').insert({
      id: crypto.randomUUID(),
      username,
      session_id,
    })

    reply.status(201).send()
  })
}