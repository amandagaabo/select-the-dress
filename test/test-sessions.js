const chai = require('chai')
const chaiHttp = require('chai-http')
const mongoose = require('mongoose')
const should = chai.should()
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
const userCredentials = {
  email: 'amanda@test.com',
  password: 'password1'
}


// // clear database
// function clearDB () {
//   console.warn('deleting database')
//   return mongoose.connection.dropDatabase()
// }


// test sessions routes
// 1. connect to database
// 2. clear users
// 3. go to sign up page (GET /sign-up)
// 4. submit sign up (POST /sign-up)
// 5. log out  (sign up auto logs in)
// 6. go to log in (GET /log-in)
// 7. log in (POST /log-in)

describe('sessions routes', function () {
  // hook functions

  before(function() {
    // start the server and connect db
    return runServer(TEST_DATABASE_URL)
  })

  beforeEach(done => {
    // remove all users in database
    User.remove({}, err => {
      if (err) {
        console.log('errors:', err)
      }
      done()
    })
  })

  after(function () {
    // stop the server and disconnect db
    return closeServer()
  })

  describe('GET request to /sign-up', done => {
    it('should return sign-up page html', function () {
      chai.request(app)
      .get('/sign-up')
      .then(res => {
        res.should.have.status(200)
        res.should.be.html
        res.text.should.include('sign-up')
        done()
      })
    })
  })

  describe('GET request to /log-in', done => {
    it('should return log in page html', function () {
      chai.request(app)
      .get('/log-in')
      .then(res => {
        res.should.have.status(200)
        res.should.be.html
        res.text.should.include('log-in')
        done()
      })
    })
  })
  // describe('POST request to /sign-up', function () {
  //   it('should redirect to add dress after successful submit', function () {
  //     return chai.request(app)
  //     .post('/sign-up')
  //     .type('form')
  //     .send({
  //       '_method': 'post',
  //       'firstName': 'Amanda',
  //       'lastName': 'H',
  //       'email': 'amanda@yahoo.com',
  //       'password': 'password123',
  //       'passwordConfirm': 'password123'
  //     })
  //     .then(res => {
  //       console.log('form submitted')
  //       // log it with passport
  //       res.should.redirect
  //       res.should.have.status(200)
  //       res.should.be.html
  //       res.text.should.include('add')
  //       return Promise.resolve()
  //     })
  //   })
  // })
  //
  // describe('POST request to /log-in', function () {
  //   it('should redirect to dresses after successful submit', function () {
  //     return chai.request(app)
  //     .post('/log-in')
  //     .then(res => {
  //       res.should.redirect
  //       res.should.have.status(200)
  //       res.should.be.html
  //       res.text.should.include('dresses')
  //       return Promise.resolve()
  //     })
  //   })
  // })
  //
  // describe('GET request to /log-out', function () {
  //   it('should redirect to home after successful log out', function () {
  //     return chai.request(app)
  //     .get('/log-out')
  //     .then(res => {
  //       res.should.have.status(200)
  //       res.should.be.html
  //       res.text.should.include('home')
  //       return Promise.resolve()
  //     })
  //   })
  // })
})
