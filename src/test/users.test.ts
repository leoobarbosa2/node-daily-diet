import { describe, it, beforeEach, afterAll, beforeAll } from 'vitest'
import { execSync } from 'node:child_process'
import request from 'supertest'
import { app } from '../app'

describe('Users Routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  it('should be able to create a new user', async () => {
    await request(app.server)
      .post('/users')
      .send({
        username: 'testing',
      }).expect(201)
  })

  it('should NOT be able to create a user with the same username', async () => {
    await request(app.server)
      .post('/users')
      .send({
        username: 'testing',
      }).expect(201)

    await request(app.server)
      .post('/users')
      .send({
        username: 'testing',
      }).expect(409)
  })
})