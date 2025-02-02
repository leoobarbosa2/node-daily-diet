import { FastifyReply, FastifyRequest } from 'fastify'
import zod from 'zod'
import { knex } from '../database'

export async function checkUserAuthority(request: FastifyRequest, reply: FastifyReply) {
  const createUserScheme = zod.object({
    session_id: zod.string(),
  })

  const { session_id } = createUserScheme.parse(request.cookies)

  const userHasCreated = (await knex('meals')).find((meal) => meal.session_id === session_id)

  if (!userHasCreated) {
    return reply.status(401).send({ error: { message: 'User not authorized!' } })
  }
}