const knex = require('../database/knex')

class MoviesController {
  async create(req, res) {
    const { title, description, tags, rating } = req.body
    const { id } = req.params

    const movie_id = await knex('movies').insert({
      title,
      description,
      rating,
      user_id: id
    })

    const tagsInsert = tags.map(name => {
      return {
        movie_id,
        user_id,
        name
      }
    })

    await knex('tags').insert(tagsInsert)

    res.res.status(201).json()
  }
}

module.exports = MoviesController
