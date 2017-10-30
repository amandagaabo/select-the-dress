// test protected routes -- without a login user should be redirected to login page for all cases
const chai = require('chai')
const chaiHttp = require('chai-http')
const should = chai.should()
const {app, runServer, closeServer} = require('../server')
const {DATABASE_URL} = require('../config/config')
const User = require('../models/user')
const Dress = require('../models/dress')

chai.use(chaiHttp)

// function to clear database users and dresses
function clearDB () {
  return User.remove({}).then(() => {
    return Dress.remove({})
  })
}
let unauthenticatedUser

describe('http requests to protected routes without login', () => {
  // hook functions using promises
  before((done) => {
    // setup user
    unauthenticatedUser = chai.request(app)
    // start the server and connect to test database (returns a promise)
    runServer(DATABASE_URL)
    .then(() => {
      // clear database (returns a promise)
      return clearDB()
      .then(() => {
        done()
      })
    })
  })

  after(function () {
    // stop the server and disconnect db
    return closeServer()
  })

  describe('GET request to /account ', () => {
    it('should redirect to log in page', (done) => {
      unauthenticatedUser
      .get('/account')
      .then ((err, res) => {
        if (err) {
          err.text.should.include('log-in')
        }
        done()
      })
    })
  })

  describe('GET request to /dresses ', () => {
    it('should redirect to log in page', (done) => {
      unauthenticatedUser
      .get('/dresses')
      .then ((err, res) => {
        if (err) {
          err.text.should.include('log-in')
        }
        done()
      })
    })
  })

})
