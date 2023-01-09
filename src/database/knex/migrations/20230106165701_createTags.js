exports.up = knex =>
  knex.schema.createTable('tags', table => {
    table.increments('id')
    table.integer('movie_id').references('movies.id').onDelete('CASCADE')
    table.integer('user_id').references('users.id').onDelete('CASCADE')
    table.text('name')
  })

exports.down = knex => knex.schema.dropTable('tags')
