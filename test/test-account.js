const chai = require('chai')
const chaiHttp = require('chai-http')

const should = chai.should()
const {app, runServer, closeServer} = require('../server')
const {TEST_DATABASE_URL} = require('../config')

chai.use(chaiHttp)

describe('accounts routes', function () {
  // hook functions
  before(function () {
    return runServer(TEST_DATABASE_URL)
  })

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

  describe('POST request to /account/edit', function () {
    it('should redirect to /account if account update was successful', function () {
      return chai.request(app)
      .post('/account/edit')
      .then(res => {
        res.should.redirect
        res.should.have.status(200)
        res.should.be.html
        res.text.should.include('account')
        return Promise.resolve()
      })
    })
  })
})
