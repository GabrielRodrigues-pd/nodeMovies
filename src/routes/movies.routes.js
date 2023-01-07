const { Router } = require('express')

const MoviesController = require('../controllers/MoviesController')
const moviesRoutes = Router()

const moviesController = new MoviesController()

moviesRoutes.post('/:id', moviesController.create)

module.exports = moviesRoutes
