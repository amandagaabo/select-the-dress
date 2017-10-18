const express = require('express')
const morgan = require('morgan')

const app = express()

// require routes
const homeRouter = require('./routes/home')

// log the http layer
app.use(morgan('common'))

// setup pug for html templates
app.set('view engine', 'pug')

// load static resources from butlic folder - images, js and css files
app.use(express.static('public'))

// routes for url endpoints
app.use('/', homeRouter)

app.listen(process.env.PORT || 8080, function () {
  console.log('app is listening on port 8080')
})

module.exports = app
