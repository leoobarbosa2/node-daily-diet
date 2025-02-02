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

  app.get('/', {
    preHandler: [checkSessionIdExists],
  }, async(request, reply) => {
    const sessionScheme = zod.object({
      session_id: zod.string(),
    })

    const { session_id } = sessionScheme.parse(request.cookies)

    const meals = await knex('meals')
      .select(
        'id',
        'name',
        'description',
        'is_diet',
        'created_at',
        'updated_at',
      )
      .from('meals')
      .where('session_id', session_id)

    return reply.status(200).send({ meals })
  })

  app.get('/:id', {
    preHandler: [checkSessionIdExists],
  }, async (request, reply) => {
    const paramsScheme = zod.object({
      id: zod.string(),
    })

    const { id } = paramsScheme.parse(request.params)

    const meal = await knex('meals').where('id', id).first()

    if(!meal) {
      return reply.status(404).send({ error: { message: 'Meal not found' } })
    }

    return reply.status(200).send({ meal })
  })

  app.put('/:id', {
    preHandler: [checkSessionIdExists],
  }, async (request, reply) => {
    const paramsScheme = zod.object({
      id: zod.string(),
    })

    const { name, description, is_diet, created_at } = createMealsScheme.parse(request.body)
    const { id } = paramsScheme.parse(request.params)

    const meal = await knex('meals').where('id', id).first()

    if(!meal) {
      return reply.status(400).send({ error: { message: 'Meal not found' } })
    }

    await knex('meals').update({
      name,
      created_at,
      description,
      is_diet,
    }).where('id', id)

    return reply.status(200).send()
  })

  app.get('/metrics', {
    preHandler: [checkSessionIdExists],
  }, async (request, reply) => {
    const sessionScheme = zod.object({
      session_id: zod.string(),
    })

    const { session_id } = sessionScheme.parse(request.cookies)

    const totalMeals = await knex('meals').count('id', { as: 'total' }).first()
    const totalOnDiet = await knex('meals').count('id', { as: 'totalOnDiet' }).where('is_diet', true).first()
    const totalOutOfDiet = await knex('meals').count('id', { as: 'totalOutOfDiet' }).where('is_diet', false).first()
    const allMeals = await knex('meals')
      .where('session_id', session_id)
      .orderBy('created_at', 'desc')

    const streakMetrics = allMeals.reduce(
      (acc, meal) => {
        if (meal.is_diet) {
          acc.currentSequence += 1
        } else {
          acc.currentSequence = 0
        }

        if (acc.currentSequence > acc.bestOnDietSequence) {
          acc.bestOnDietSequence = acc.currentSequence
        }

        return acc
      },
      { bestOnDietSequence: 0, currentSequence: 0 },
    )

    return reply.status(200).send({
      metrics: {
        ...totalMeals,
        ...totalOnDiet,
        ...totalOutOfDiet,
        ...streakMetrics,
      },
    })
  })

  app.delete('/:id', {
    preHandler: [checkSessionIdExists],
  }, async (request, reply) => {
    const paramsScheme = zod.object({
      id: zod.string(),
    })

    const { id } = paramsScheme.parse(request.params)

    const meal = await knex('meals').where('id', id).first()

    if(!meal) {
      return reply.status(400).send({ error: { message: 'Meal not found' } })
    }

    await knex('meals').where('id', id).delete()

    return reply.status(204).send()
  })
}