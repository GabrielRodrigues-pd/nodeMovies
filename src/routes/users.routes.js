const { Routes } = require('express')

const UsersController = require('../controllers/UsersController')

const usersRoutes = Routes()

const usersController = new UsersController()

usersRoutes.pos('/', usersController.create)

module.exports = usersRoutes
