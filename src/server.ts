import fastify from 'fastify'
import { userRoutes } from './routes/usersRoutes'
import { mealsRoutes } from './routes/mealsRoutes'
import { env } from './env'

const app = fastify()

app.register(userRoutes, { prefix: '/users' })
app.register(mealsRoutes, { prefix: '/meals' })

app.listen({
  port: env.PORT,
  host: 'localhost',
}).then(() => {
  console.log('HTTP server is running! 🚀')
})