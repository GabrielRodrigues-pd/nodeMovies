require('express-async-errors')

const database = require('./database')

const express = require('express')

const app = express()
app.use(express.json())

app.use(routes)

database()

const PORT = 7777

app.listen(PORT, () => console.log(`Server is running on Port ${PORT}`))
