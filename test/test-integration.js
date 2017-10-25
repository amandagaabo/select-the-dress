const mongoose = require('mongoose')
const chai = require('chai')
const chaiHttp = require('chai-http')
const should = chai.should()
const request = require('supertest')
const {app, runServer, closeServer} = require('../server')
const {TEST_DATABASE_URL} = require('../config/config')
const User = require('../models/user')

chai.use(chaiHttp)

// data for a new user that will sign up for an account
const userData = {
  email: 'amanda@test.com',
  firstName: 'Amanda',
  lastName: 'H',
  password: 'password1',
  passwordConfirm: 'password1'
}

// user credentials for login
const userLogin = {
  email: 'amanda@test.com',
  password: 'password1'
}

// new user data for account update
const updateData = {
  email: 'ashley@test.com',
  firstName: 'Ashley',
  lastName: 'G'
}

// clear database
function clearDB () {
  console.log('clearing database')
  return mongoose.connection.dropDatabase()
}

// test sessions routes
// 1. connect to server and database
// 2. clear User collection in database
// 3. GET / page
// 4. GET /sign-up page
// 5. GET /log-in page
// 6. create account with userData above
// 7. log user out
// 8. log user back in with userLogin above (same user as created in step 5, so database is only cleared in the before hook not before each)
// 9. GET /account page
// 10. POST /account page

let authenticatedUser

describe('integration http request tests', function () {
  // hook functions using promises
  before((done) => {
    console.log('sessions before hook start')
    // setup authenticated user
    authenticatedUser = chai.request.agent(app)

    // start the server and connect to test database (returns a promise)
    runServer(TEST_DATABASE_URL)
    .then(() => {
      // clear database (returns a promise)
      clearDB()
    })
    .then(() => {
      console.log('sessions before hook end')
      done()
    })
  })

  after(() => {
    // stop the server and disconnect db
    return closeServer()
  })

  describe('GET request to / ', function () {
    it('should return home page html', function () {
      return chai.request(app)
      .get('/')
      .then(res => {
        res.should.have.status(200)
        res.should.be.html
        res.text.should.include('home')
        return Promise.resolve()
      })
    })
  })

  describe('GET request to /sign-up', () => {
    it('should return sign-up page html', (done) => {
      chai.request(app)
      .get('/sign-up')
      .end((err, res) => {
        res.should.have.status(200)
        res.should.be.html
        res.text.should.include('sign-up')
        done()
      })
    })
  })

  describe('GET request to /log-in', () => {
    it('should return log in page html', (done) => {
      chai.request(app)
      .get('/log-in')
      .end((err, res) => {
        res.should.have.status(200)
        res.should.be.html
        res.text.should.include('log-in')
        done()
      })
    })
  })

  describe('POST request to /sign-up', () => {
    it('should log user in then redirect to dresses/add', (done) => {
      authenticatedUser
      .post('/sign-up')
      // change request content-type to form urlencoded so it works with bodyParser
      .set('content-type', 'application/x-www-form-urlencoded')
      // send form data
      .send(userData)
      // .end runs after we get a respnose from the server
      .end((err, res) => {
        if (err) {
          console.log('errors during submit account sign up')
        }
        // console.log('account sign up successful')
        res.should.have.status(200)
        res.should.redirect
        res.should.be.html
        res.text.should.include('add-dress')
        done()
      })
    })
  })

  describe('GET request to /log-out', () => {
    it('should redirect to home', (done) => {
      authenticatedUser
      .get('/log-out')
      .end((err, res) => {
        res.should.have.status(200)
        res.should.be.html
        res.text.should.include('home')
        done()
      })
    })
  })

  describe('POST request to /log-in', () => {
    it('should redirect to /dresses/add since user has no dresses', (done) => {
      // use agent to maintain cookies
      authenticatedUser
      .post('/log-in')
      // change request content-type to form urlencoded so it works with bodyParser for HTML forms
      .set('content-type', 'application/x-www-form-urlencoded')
      .send(userLogin)
      // wait for response
      .end((err, res) => {
        if (err) {
          console.log('errors during log in')
        }
        // console.log('user logged in!')
        res.should.have.status(200)
        res.should.redirect
        res.should.be.html
        res.text.should.include('add-dress')
        done()
      })
    })
  })

  describe('GET request to /account', function()  {
    it('should return the account page html', (done) => {
      authenticatedUser
      .get('/account')
      .end((err, res) => {
        res.should.have.status(200)
        res.should.be.html
        res.text.should.include('account')
        res.text.should.include(userData.firstName, userData.lastName, userData.email)
        done()
      })
    })
  })

  describe('POST request to /account', function () {
    it('should redirect to /account if account update was successful', (done) => {
      authenticatedUser
      .post('/account')
      // change request content-type to form urlencoded
      .set('content-type', 'application/x-www-form-urlencoded')
      .send(updateData)
      .end((err, res) => {
        res.should.redirect
        res.should.have.status(200)
        res.should.be.html
        res.text.should.include('account')
        res.text.should.include(updateData.firstName, updateData.lastName, updateData.email)
        done()
      })
    })
  })

})
