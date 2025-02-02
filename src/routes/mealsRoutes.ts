import { FastifyInstance } from 'fastify'
import crypto from 'node:crypto'
import zod from 'zod'
import { knex } from '../database'
import { checkSessionIdExists } from '../middlewares/checkSessionIdExists'
import { createMealsScheme } from '../schemes/meals'

export async function mealsRoutes(app: FastifyInstance){
  app.post('/', {
    preHandler: [checkSessionIdExists],
  }, async(request, reply) => {
    const sessionScheme = zod.object({
      session_id: zod.string(),
    })

    const { name, description, is_diet } = createMealsScheme.parse(request.body)
    const { session_id } = sessionScheme.parse(request.cookies)

    await knex('meals').insert({
      id: crypto.randomUUID(),
      session_id,
      name,
      is_diet,
      description,
    })

    await reply.status(201).send()
  })
}