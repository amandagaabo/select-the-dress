const chai = require('chai')
const chaiHttp = require('chai-http')
const should = chai.should()
const request = require('supertest')
const {app, runServer, closeServer} = require('../server')
const {TEST_DATABASE_URL} = require('../config/config')
const User = require('../models/user')
const Dress = require('../models/dress')

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

// user data for account update
const updateData = {
  email: 'ashley@test.com',
  firstName: 'Ashley',
  lastName: 'G'
}

// new dress to add
const newDress = {
  rating: 3,
  designer: 'maggie sottero',
  style: 'amara',
  price: '$1700',
  store: 'boulder bridal',
  notes: 'love the neckline, lots of lace, beautiful dress'
}

// dress data for dress update
const updateDress = {
  rating: 4,
  designer: 'vera wang',
  style: 'amara',
  price: '$1400',
  store: 'botique b',
  notes: 'great dress!'
}

// clear database users and dresses
function clearDB () {
  return User.remove({}).then(() => {
    return Dress.remove({})
  })
}

// test sessions routes
// 1. connect to server and database
// 2. clear User and Dress collections in database
// 3. create account with userData above
// 4. GET / page
// 5. log user out
// 6. GET /sign-up page
// 7. GET /log-in page
// 8. log user back in with userLogin above (same user as created in step 3, so database is only cleared in the before hook not before each)
// 9. GET /account page
// 10. POST /account - update account info
// 11. GET /add dress page
// 12. POST /add dress page
// 13. GET /dresses/dress page
// 14. GET /dresses/dress edit page
// 15. POST /dress/dress  - update dress info
// 16. POST /dress/delete

let authenticatedUser

describe('integration http request tests', function () {
  // increase timeout limit for account create
  this.timeout(5000)

  // hook functions using promises
  before((done) => {
    console.log('sessions before hook start')
    // setup authenticated user
    authenticatedUser = chai.request.agent(app)

    // start the server and connect to test database (returns a promise)
    runServer(TEST_DATABASE_URL)
    .then(() => {
      // clear database (returns a promise)
      return clearDB()
    })
    .then(() => {
      // create a new user
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

          console.log('account sign up successful')
          res.should.have.status(200)
          res.should.redirect
          res.should.be.html
          res.text.should.include('add-dress')
          done()
        })
    })
  })

  after(function () {
    // stop the server and disconnect db
    return closeServer()
  })

  // example returing a promise rather than using done
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

  // user was auto logged in, so we can test the log out
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
        res.text.should.include('account', 'success')
        res.text.should.include(updateData.firstName, updateData.lastName, updateData.email)
        done()
      })
    })
  })

  describe('GET request to /dresses/add', function()  {
    it('should return the add dress page html', (done) => {
      authenticatedUser
      .get('/dresses/add')
      .end((err, res) => {
        res.should.have.status(200)
        res.should.be.html
        res.text.should.include('add-dress')
        done()
      })
    })
  })

  describe('POST request to /dresses/add', function () {
    it('should redirect to /dresses if dress add was successful', (done) => {
      authenticatedUser
        .post('/dresses/add')
        // change request content-type to form urlencoded
        .set('content-type', 'application/x-www-form-urlencoded')
        .send(newDress)
        .end((err, res) => {
          res.should.redirect
          res.should.have.status(200)
          res.should.be.html
          res.text.should.include('dresses', 'success')
          res.text.should.include(newDress.designer, newDress.style, newDress.store)
          done()
        })
    })
  })

  describe('GET request to /dresses/:dress', function()  {
    it('should return the dress page html', (done) => {
      // find one dress to use the id
      Dress.findOne()
      .then((dress) => {
        authenticatedUser
        .get(`/dresses/${dress._id}`)
        .end((err, res) => {
          res.should.have.status(200)
          res.should.be.html
          res.text.should.include('dress')
          res.text.should.include(newDress.designer, newDress.style, newDress.store)
          done()
        })
      })
    })
  })

  describe('GET request to /dresses/:dress/edit', function()  {
    it('should return the edit dress page html', (done) => {
      // find one dress to use the id
      Dress.findOne()
      .then((dress) => {
        authenticatedUser
        .get(`/dresses/${dress._id}/edit`)
        .end((err, res) => {
          res.should.have.status(200)
          res.should.be.html
          res.text.should.include('dress-edit')
          res.text.should.include(newDress.designer, newDress.style, newDress.store)
          done()
        })
      })
    })
  })

  describe('POST request to /dresses/:dress/edit', function () {
    it('should redirect to /dresses/:dress if dress update was successful', (done) => {
      // find one dress to use the id
      Dress.findOne()
      .then((dress) => {
        authenticatedUser
        .post(`/dresses/${dress._id}/edit`)
        // change request content-type to form urlencoded
        .set('content-type', 'application/x-www-form-urlencoded')
        .send(updateDress)
        .end((err, res) => {
          res.should.redirect
          res.should.have.status(200)
          res.should.be.html
          res.text.should.include('dress', 'success')
          res.text.should.include(updateDress.designer, updateDress.style, updateDress.store, updateDress.notes)
          done()
        })
      })
    })
  })

  describe('POST request to /dresses/:dress/delete ', function () {
    it('should respond with ok if successful', function () {
      // find one dress to use the id
      Dress.findOne()
      .then((dress) => {
        authenticatedUser
        .post(`/dresses/${dress._id}/delete`)
        .then(res => {
          res.should.have.status(200)
          res.text.should.include('OK')
          return Promise.resolve()
        })
      })
    })
  })

})
