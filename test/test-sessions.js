const chai = require('chai')
const chaiHttp = require('chai-http')

const should = chai.should()
const {app, runServer, closeServer} = require('../server')
const {TEST_DATABASE_URL} = require('../config')

chai.use(chaiHttp)

describe('sessions routes', function () {
  // hook functions
  before(function () {
    return runServer(TEST_DATABASE_URL)
  })

  after(function () {
    return closeServer()
  })

  describe('GET request to /sign-up', function () {
    it('should return sign-up page html', function () {
      return chai.request(app)
      .get('/sign-up')
      .then(res => {
        res.should.have.status(200)
        res.should.be.html
        res.text.should.include('sign-up')
        return Promise.resolve()
      })
    })
  })

  //// FIX AFTER AUTH IS SET UP ////
  // describe('POST request to /sign-up', function () {
  //   it('should redirect to dresses after successful submit', function () {
  //     return chai.request(app)
  //     .post('/sign-up')
  //     .then(res => {
  //       res.should.redirect
  //       res.should.have.status(200)
  //       res.should.be.html
  //       res.text.should.include('dresses')
  //       return Promise.resolve()
  //     })
  //   })
  // })

  describe('GET request to /log-in', function () {
    it('should return log in page html', function () {
      return chai.request(app)
      .get('/log-in')
      .then(res => {
        res.should.have.status(200)
        res.should.be.html
        res.text.should.include('log-in')
        return Promise.resolve()
      })
    })
  })

  describe('POST request to /log-in', function () {
    it('should redirect to dresses after successful submit', function () {
      return chai.request(app)
      .post('/log-in')
      .then(res => {
        res.should.redirect
        res.should.have.status(200)
        res.should.be.html
        res.text.should.include('dresses')
        return Promise.resolve()
      })
    })
  })

  describe('GET request to /log-out', function () {
    it('should redirect to home after successful log out', function () {
      return chai.request(app)
      .get('/log-out')
      .then(res => {
        res.should.have.status(200)
        res.should.be.html
        res.text.should.include('home')
        return Promise.resolve()
      })
    })
  })
})
