import { FastifyReply, FastifyRequest } from 'fastify'
import zod from 'zod'

export async function checkSessionIdExists(request: FastifyRequest, reply: FastifyReply) {
  const sessionScheme = zod.object({
    session_id: zod.string(),
  })

  const scheme = sessionScheme.safeParse(request.cookies)

  if(scheme.error) {
    return reply.status(401).send({ error: { message: 'User not authorized' } })
  }
}