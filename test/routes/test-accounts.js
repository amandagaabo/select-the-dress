const chai = require('chai')
const should = chai.should()
const proxyquire = require('proxyquire')
const sinon = require('sinon')
const User = require('../../models/user')

let accounts
let findStub
let findOneStub

describe('The account route', function () {
  before(function () {
    findStub = sinon.stub(User, 'find')
    findOneStub = sinon.stub(User, 'findOne')

    accounts = proxyquire('../../routes/accounts', { '../models/user': {
      find: findStub,
      findOne: findOneStub
    }})
  })

  after(function () {
    User.find.restore()
    User.findOne.restore()
  })

  it('should export all the required functions', function () {
    accounts.should.respondTo('loadUser')
    accounts.should.respondTo('readPage')
    accounts.should.respondTo('update')
  })

  describe('should handle loadUser', function () {
    const req = {
      user: { _id: '123' }
    }

    it('with no user found', function (done) {
      findOneStub.resolves(null)

      const res = {
        send: function (message) {
          message.should.equal('error, no user found')
          done()
        }
      }

      accounts.loadUser(req, res)
    })

    it('with a model error', function (done) {
      findOneStub.rejects(new Error('Yikes!'))

      const next = function (err) {
        err.should.exist
        done()
      }

      accounts.loadUser(req, null, next)
    })

    it('with a user found', function (done) {
      const user = { _id: '123', firstName: 'Amanda' }

      findOneStub.resolves(user)

      const next = function (err) {
        should.not.exist(err)
        req.account.should.equal(user)
        done()
      }

      accounts.loadUser(req, null, next)
    })
  })

  it('should handle the readPage', function (done) {
    const req = {
      account: {
        _id: '123',
        firstName: 'Sally',
        lastName: 'b'
      }
    }

    const res = {
      locals: {},
      render: function (template, data) {
        template.should.equal('account')
        data.account.should.equal(req.account)
        done()
      }
    }
    accounts.readPage(req, res)
  })

  xit('should handle the update function', function (done) {


    accounts.update(req, res)
  })



})
