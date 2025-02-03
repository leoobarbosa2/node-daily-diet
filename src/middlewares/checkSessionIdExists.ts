import { FastifyReply, FastifyRequest } from 'fastify'
import zod from 'zod'
import { knex } from '../database'

export async function checkSessionIdExists(request: FastifyRequest, reply: FastifyReply) {
  const sessionScheme = zod.object({
    session_id: zod.string(),
  })

  const scheme = sessionScheme.safeParse(request.cookies)
  const { data } = scheme

  if(scheme.error) {
    return reply.status(401).send({ error: { message: 'Session id not provided' } })
  }

  const user = await knex('users').where('session_id', data?.session_id).first()

  if (!user) {
    return reply.status(401).send({ error: 'Unauthorized' })
  }
}