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
const userLogin = {
  email: 'amanda@test.com',
  password: 'password1'
}


// // clear database
// function clearDB () {
//   console.warn('deleting database')
//   return mongoose.connection.dropDatabase()
// }


// test sessions routes
// 1. connect to server and database
// 2. clear User collection in database
// 3. GET /sign-up page
// 4. GET /log-in page
// 5. create account with userData above
// 6. log user out
// 7. log user back in with userLogin above (same user as created in step 5, so database is only cleared in the before hook not before each)

describe('sessions routes', function () {
  // hook functions

  before(done => {
    // start the server and connect db
    runServer(TEST_DATABASE_URL)
    .then(() => {
      // remove all users in database
      User.remove({}, err => {
        if (err) {
          console.log('errors clearing db Users')
        }
        done()
      })
    })
  })

  after(function () {
    // stop the server and disconnect db
    return closeServer()
  })

  describe('GET request to /sign-up', () => {
    it('should return sign-up page html', done => {
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

  describe('GET request to /log-in', () => {
    it('should return log in page html', done => {
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

  describe('POST request to /sign-up', () => {
    it('should log user in then redirect to dresses/add', done => {
       chai.request(app)
      .post('/sign-up')
      // send form data
      .send(userData)
      // .end runs after we get a respnose from the server
      .end((err, res) => {
        if (err) {
          console.log('errors during submit account sign up')
        } else {
          res.should.have.status(200)
          res.should.redirect
          res.should.be.html
          res.text.should.include('log-in')
        }
        done()
      })
    })
  })

  describe('GET request to /log-out', () => {
    it('should redirect to home', done => {
      chai.request(app)
      .get('/log-out')
      .then(res => {
        res.should.have.status(200)
        res.should.be.html
        res.text.should.include('home')
        done()
      })
    })
  })

  // need to update to include sessions so after login user is not redirected to login
  describe('POST request to /log-in', () => {
    it('should redirect to /dresses', done => {
      chai.request(app)
      .post('/log-in')
      .send(userLogin)
      // wait for response
      .end((err, res) => {
        if (err) {
          console.log('errors during log in')
        } else {
          console.log('user logged in!')
          console.log('logs show the user was redirected to /dresses then redirected to /log-in this is because sessions are not setup yet in this test')
          res.should.have.status(200)
          res.should.redirect
          res.should.be.html
          res.text.should.include('dresses')
          done()
        }
      })
    })
  })

})
