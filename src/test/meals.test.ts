import { describe, it, beforeAll, afterAll, beforeEach, expect } from 'vitest'
import request from 'supertest'
import { execSync } from 'node:child_process'
import { app } from '../app'

describe('Meals Routes', () => {
  beforeAll(async() => {
    await app.ready()
  })

  afterAll(async() => {
    await app.close()
  })

  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  it('it should be able to register a meal', async () => {
    const user = await request(app.server).post('/users')
      .send({ username: 'testing' })
      .expect(201)

    const cookies = user.get('Set-Cookie')

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies as string[])
      .send({
        name: 'X Burguer',
        description: 'The ultimate burguer',
        is_diet: false,
      }).expect(201)
  })

  it('it should be able to list all meals', async () => {
    const user = await request(app.server).post('/users')
      .send({ username: 'testing' })
      .expect(201)

    const cookies = user.get('Set-Cookie')

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies as string[])
      .send({
        name: 'X Burguer',
        description: 'The ultimate burguer',
        is_diet: false,
      }).expect(201)

    await request(app.server)
      .get('/meals')
      .set('Cookie', cookies as string[])
      .expect(200)
  })

  it('it should be able to list a single meal', async () => {
    const user = await request(app.server).post('/users')
      .send({ username: 'testing' })
      .expect(201)

    const cookies = user.get('Set-Cookie')

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies as string[])
      .send({
        name: 'X Burguer',
        description: 'The ultimate burguer',
        is_diet: false,
      }).expect(201)

    const allMeals = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies as string[])
      .expect(200)

    const firstMealId = allMeals.body.meals[0].id

    const singleMeal = await request(app.server)
      .get(`/meals/${firstMealId}`)
      .set('Cookie', cookies as string[])
      .expect(200)

    expect(singleMeal.body.meal.id).toEqual(firstMealId)
  })

  it('it should be able edit a single meal', async () => {
    const user = await request(app.server).post('/users')
      .send({ username: 'testing' })
      .expect(201)

    const cookies = user.get('Set-Cookie')

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies as string[])
      .send({
        name: 'X Burguer',
        description: 'The ultimate burguer',
        is_diet: false,
      }).expect(201)

    const allMeals = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies as string[])
      .expect(200)

    const firstMealId = allMeals.body.meals[0].id

    await request(app.server)
      .put(`/meals/${firstMealId}`)
      .set('Cookie', cookies as string[])
      .send({
        name: 'New Burguer',
        description: 'The ultimate new burguer',
        is_diet: true,
      })
      .expect(200)
  })

  it('it should be able delete a single meal', async () => {
    const user = await request(app.server).post('/users')
      .send({ username: 'testing' })
      .expect(201)

    const cookies = user.get('Set-Cookie')

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies as string[])
      .send({
        name: 'X Burguer',
        description: 'The ultimate burguer',
        is_diet: false,
      }).expect(201)

    const allMeals = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies as string[])
      .expect(200)

    const firstMealId = allMeals.body.meals[0].id

    await request(app.server)
      .delete(`/meals/${firstMealId}`)
      .set('Cookie', cookies as string[])
      .expect(204)
  })

  it('it should be able list metrics for all meals', async () => {
    const user = await request(app.server).post('/users')
      .send({ username: 'testing' })
      .expect(201)

    const cookies = user.get('Set-Cookie')

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies as string[])
      .send({
        name: 'X Burguer',
        description: 'The ultimate burguer',
        is_diet: false,
      }).expect(201)

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies as string[])
      .send({
        name: 'Salad',
        description: 'A delicious salad',
        is_diet: true,
      }).expect(201)

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies as string[])
      .send({
        name: 'Orange juice',
        description: 'A fresh orange juice',
        is_diet: true,
      }).expect(201)

    const metrics = await request(app.server)
      .get('/meals/metrics')
      .set('Cookie', cookies as string[])
      .expect(200)

    const { total, totalOnDiet, totalOutOfDiet, bestOnDietSequence } = metrics.body?.metrics ?? {}

    expect(total).toEqual(3)
    expect(totalOnDiet).toEqual(2)
    expect(totalOutOfDiet).toEqual(1)
    expect(bestOnDietSequence).toEqual(2)
  })
})