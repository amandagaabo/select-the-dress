const chai = require('chai')
const chaiHttp = require('chai-http')
const should = chai.should()
const {app, runServer, closeServer} = require('../server')
const {TEST_DATABASE_URL} = require('../config/config')
const User = require('../models/user')
const faker = require('faker')

chai.use(chaiHttp)

// seed data
function seedData () {
  console.info('seeding user data')
  const seedData = []

  for (let i = 1; i <= 5; i++) {
    seedData.push(generateData())
  }
  // this will return a promise
  return User.insertMany(seedData)
}

// generate user with fake data
function generateData () {
  return {
    email: faker.internet.email(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName,
    password: faker.internet.password()
  }
}

// clear database
function clearDB () {
  console.warn('Deleting database')
  return mongoose.connection.dropDatabase()
}

describe('accounts routes', function () {
  // hook functions
  before(function () {
    return runServer(TEST_DATABASE_URL)
  })

  // beforeEach(function() {
  //   seedData()
  // })
  //
  // afterEach(function () {
  //   return clearDB()
  // })

  after(function () {
    return closeServer()
  })

  describe('GET request to /account', function () {
    it('should return account page html', function () {
      return chai.request(app)
      .get('/account')
      .then(res => {
        res.should.have.status(200)
        res.should.be.html
        res.text.should.include('account')
        return Promise.resolve()
      })
    })
  })

  describe('GET request to /account/edit', function () {
    it('should return edit account page html', function () {
      return chai.request(app)
      .get('/account/edit')
      .then(res => {
        res.should.have.status(200)
        res.should.be.html
        res.text.should.include('account-edit')
        return Promise.resolve()
      })
    })
  })

  //// FIX AFTER AUTH IS SET UP ////
  // describe('POST request to /account/edit', function () {
  //   it('should redirect to /account if account update was successful', function () {
  //     return chai.request(app)
  //     // get user id
  //     User.findOne({_id:req.user._id})
  //     .then(_user => {
  //
  //     })
  //
  //     .post('/account/edit')
  //     .then(res => {
  //       res.should.redirect
  //       res.should.have.status(200)
  //       res.should.be.html
  //       res.text.should.include('account')
  //       return Promise.resolve()
  //     })
  //   })
  // })
})
