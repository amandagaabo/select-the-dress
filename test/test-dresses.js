const chai = require('chai')
const chaiHttp = require('chai-http')

const should = chai.should()
const {app, runServer, closeServer} = require('../server')
const {TEST_DATABASE_URL} = require('../config')

chai.use(chaiHttp)

describe('dresses routes', function () {
  // hook functions
  before(function () {
    return runServer(TEST_DATABASE_URL)
  })

  after(function () {
    return closeServer()
  })

  describe('GET request to /dresses ', function () {
    it('should return dresses page html', function () {
      return chai.request(app)
      .get('/dresses')
      .then(res => {
        res.should.have.status(200)
        res.should.be.html
        res.text.should.include('dresses')
        return Promise.resolve()
      })
    })
  })

  describe('GET request to /dresses/add ', function () {
    it('should return dress form page html', function () {
      return chai.request(app)
      .get('/dresses/add')
      .then(res => {
        res.should.have.status(200)
        res.should.be.html
        res.text.should.include('add-dress')
        return Promise.resolve()
      })
    })
  })

    describe('POST request to /dresses/add ', function () {
      it('should redirect to /dresses if dress creation was successful', function () {
        return chai.request(app)
        .post('/dresses/add')
        .then(res => {
          res.should.redirect
          res.should.have.status(200)
          res.should.be.html
          res.text.should.include('dresses')
          return Promise.resolve()
        })
      })
    })

    describe('GET request to /dresses/compare ', function () {
      it('should return comparison page html', function () {
        return chai.request(app)
        // test comparision ids are used, defined in dresses.js development data
        .get(`/dresses/compare?dressA=1575875a&dressB=3575875c`)
        .then(res => {
          res.should.have.status(200)
          res.should.be.html
          res.text.should.include('compare')
          return Promise.resolve()
        })
      })
    })

    describe('GET request to /dresses/:dress ', function () {
      it('should return dress page html', function () {
        return chai.request(app)
        // test id is used, defined in dresses.js development data
        .get('/dresses/1575875a')
        .then(res => {
          res.should.have.status(200)
          res.should.be.html
          res.text.should.include('dress')
          return Promise.resolve()
        })
      })
    })

    describe('GET request to /dresses/:dress/edit ', function () {
      it('should return dress form html', function () {
        return chai.request(app)
        // test id is used, defined in dresses.js development data
        .get('/dresses/1575875a/edit')
        .then(res => {
          res.should.have.status(200)
          res.should.be.html
          res.text.should.include('dress-edit')
          return Promise.resolve()
        })
      })
    })

    describe('POST request to /dresses/:dress/edit ', function () {
      it('should redirect to /:dress if dress update was successful', function () {
        return chai.request(app)
        // test id is used, defined in dresses.js development data
        .post('/dresses/1575875a/edit')
        .then(res => {
          res.should.redirect
          res.should.have.status(200)
          res.should.be.html
          res.text.should.include('dress')
          return Promise.resolve()
        })
      })
    })

    describe('POST request to /dresses/:dress/delete ', function () {
      it('should redirect to /dresses if dress deletion was successful', function () {
        return chai.request(app)
        // test id is used, defined in dresses.js development data
        .post('/dresses/1575875a/delete')
        .then(res => {
          res.should.have.status(200)
          res.text.should.include('OK')
          return Promise.resolve()
        })
      })
    })
})
