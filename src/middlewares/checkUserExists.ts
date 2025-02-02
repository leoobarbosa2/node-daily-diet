import { FastifyReply, FastifyRequest } from 'fastify'
import zod from 'zod'
import { knex } from '../database'

export async function checkUserExists(request: FastifyRequest, reply: FastifyReply) {
  const createUserScheme = zod.object({
    username: zod.string(),
  })

  const { username } = createUserScheme.parse(request.body)

  const userExists = (await knex('users')).find(user => user.username === username)

  if(userExists) {
    return reply.status(409).send({ error: {
      message: 'User already exists',
    } })
  }
}