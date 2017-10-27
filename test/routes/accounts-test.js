const chai = require('chai')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
const should = chai.should()
chai.use(sinonChai)
const proxyquire = require('proxyquire')
const User = require('../../models/user')

let accounts
let findStub
let findOneStub

describe('The accounts route', function () {
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
      account: {}
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

  describe('should handle the update function', function (done) {

    it('with successful save', function (done) {
      const flashSpy = sinon.spy()

      const req = {
        body: {},
        account: {
          save: sinon.stub().resolves()
        },
        flash: flashSpy
      }

      const res = {
        redirect: function (path) {
          path.should.equal('/account')
          flashSpy.should.have.been.calledOnce
          flashSpy.should.have.been.calledWith('success', 'Account updated')
          done()
        }
      }

      accounts.update(req, res)
    })

    it('and fail with validation errors', function (done) {
      const error = {
        name: 'ValidationError',
        errors: {
          firstName: {
            message: 'First name is required'
          }
        }
      }

      const req = {
        body: {},
        account: {
          save: sinon.stub().rejects(error)
        },
      }

      const res = {
        locals: {
          messages: {}
        },
        render: function (template, locals) {
          locals.messages.errors.should.have.length(1)
          locals.messages.errors[0].should.exist
          locals.messages.errorFields.should.have.length(1)
          locals.messages.errorFields[0].should.equal('firstName')
          template.should.equal('account')
          done()
        }
      }

      accounts.update(req, res)
    })

    it('and fail with a non-validation error', function (done) {
      const error = {
        name: 'SomeOtherError',
      }

      const req = {
        body: {},
        account: {
          save: sinon.stub().rejects(error)
        },
      }

      const res = {
        locals: {
          messages: {}
        },
        render: function (template, locals) {
          locals.messages.errors.should.have.length(1)
          locals.messages.errors[0].should.exist
          should.not.exist(locals.messages.errorFields)
          template.should.equal('account')
          done()
        }
      }

      accounts.update(req, res)
    })
  })
})
