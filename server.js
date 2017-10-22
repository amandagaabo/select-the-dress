// setup environment variables, looks for .env file and loads the env variables
require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

// Mongoose internally uses a promise-like object,
// but its better to make Mongoose use built in es6 promises
mongoose.Promise = global.Promise

const {TEST_DATABASE_URL, PORT} = require('./config')

const app = express()

// require routes
const router = require('./routes')

// setup pug for html templates
app.set('view engine', 'pug')

// load static resources from butlic folder - images, js and css files
app.use(express.static('public'))

// log the http layer
app.use(morgan('common'))

// use body parser middleware
app.use(bodyParser.urlencoded({extended: true}))

// middleware function to setup state variables, mock data used here
app.use(function (req, res, next) {
  res.locals = {}
  res.locals.user = {
    isLoggedIn: true
  }
  next()
})

// fake passport user id
app.use(function(req, res, next) {
  req.user = {
    _id: new mongoose.mongo.ObjectId('59ebf98874314249688ae2a1')
  }
  next()
})

// setup routes
app.use('/', router)

// catch-all endpoint if client makes request to non-existent endpoint
app.use('*', function (req, res) {
  res.status(404).json({message: 'Not Found'})
})

// closeServer needs access to a server object, but that only
// gets created when `runServer` runs, so we declare `server` here
// and then assign a value to it in run
let server

// this function connects to our database, then starts the server
function runServer (databaseUrl = TEST_DATABASE_URL, port = PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, {useMongoClient: true}, err => {
      if (err) {
        return reject(err)
      }
      server = app.listen(port, () => {
        // console.log(`Your app is listening on port ${port}`)
        resolve()
      })
      .on('error', err => {
        mongoose.disconnect()
        reject(err)
      })
    })
  })
}

// this function closes the server, and returns a promise. we'll
// use it in our integration tests later.
function closeServer () {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      // console.log('Closing server')
      server.close(err => {
        if (err) {
          return reject(err)
        }
        resolve()
      })
    })
  })
}

// if server.js is called directly (aka, with `node server.js`), this block runs.
// but we also export the runServer command so other code (for instance, test code) can start the server as needed.
if (require.main === module) {
  runServer().catch(err => console.error(err))
}

module.exports = {app, runServer, closeServer}
