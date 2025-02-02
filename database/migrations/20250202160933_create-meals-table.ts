import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('meals', (table) => {
    table.uuid('id').primary()
    table.uuid('session_id').after('id')
    table.text('name').notNullable()
    table.text('description').notNullable()
    table.boolean('is_diet').notNullable().defaultTo(false)
    table.timestamps({ defaultToNow: true, useTimestamps: true })
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('meals')
}

