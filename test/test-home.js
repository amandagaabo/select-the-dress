const chai = require('chai')
const chaiHttp = require('chai-http')

const should = chai.should()
const {app, runServer, closeServer} = require('../server')
const {TEST_DATABASE_URL} = require('../config')

chai.use(chaiHttp)

describe('Select the dress app', function () {
  // hook functions
  before(function () {
    return runServer(TEST_DATABASE_URL)
  })

  after(function () {
    return closeServer()
  })

  // test get request to home (/)s
  describe('home endpoint', function() {
    it('should return home page html', function () {
      return chai.request(app)
      .get('/')
      .then(res => {
        res.should.have.status(200)
        res.should.be.html
        return Promise.resolve()
      })
    })
  })
})
