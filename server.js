'use strict'
// setup environment variables, looks for .env file and loads the env variables
require('dotenv').config()

// setup express app
const express = require('express')
const app = express()

// setup mongoose
const mongoose = require('mongoose')
// make Mongoose use built in es6 promises
mongoose.Promise = global.Promise

// setup config and routes
const {DATABASE_URL, PORT} = require('./config/config')

// require packages
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const passport = require('passport')
const flash = require('connect-flash')
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session)

// setup pug for html templates
app.set('view engine', 'pug')

// load static resources from butlic folder - images, js and css files
app.use(express.static('public'))

// log the http layer middleware
app.use(morgan('common'))
// read cookies middleware (auth)
app.use(cookieParser())
// use body parser middleware (urlencoded for form data)
app.use(bodyParser.urlencoded({extended: true}))

// setup session, store data in database
app.use(session({
  secret: process.env.PASSPORT_SECRET,
  resave: true,
  saveUninitialized: true,
  store: new MongoDBStore({
    uri: DATABASE_URL,
    collection: 'sessions'
  })
}))

// use flash messages, stored in session
app.use(flash())

const passportConfig = require('./config/passport')
passportConfig(app, passport)

// middleware function to setup locals in response object
app.use(function (req, res, next) {
  res.locals = {
    messages: {
      errors: req.flash('error'),
      success: req.flash('success'),
      errorFields: ''
    },
    user: req.user
  }

  next()
})

// setup routes
const router = require('./routes')
app.use('/', router(passport))

// catch-all endpoint if client makes request to non-existent endpoint
app.use('*', function (req, res) {
  res.status(404).json({message: 'Not Found'})
})

// closeServer needs access to a server object, but that only
// gets created when `runServer` runs, so we declare `server` here
// and then assign a value to it in run
let server

// this function connects to our database, then starts the server
function runServer (databaseUrl = DATABASE_URL, port = PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, {useMongoClient: true}, err => {
      if (err) {
        return reject(err)
      }
      server = app.listen(port, () => {
        console.log(`server started: app is listening on port ${port}`)
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
      console.log('closing server')
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
