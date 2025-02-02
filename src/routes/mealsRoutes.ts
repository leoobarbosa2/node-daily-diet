import { FastifyInstance } from 'fastify'

export async function mealsRoutes(app: FastifyInstance){
  app.post('/', async(request, reply) => {
    console.log(`${request.method}`)

    await reply.send('Meals!')
  })
}