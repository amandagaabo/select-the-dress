const chai = require('chai')
const sinonChai = require('sinon-chai')
const should = chai.should()
chai.use(sinonChai)
const proxyquire = require('proxyquire')
const sinon = require('sinon')
const User = require('../../models/user')

let sessions
let findOneStub

describe('The sessions route', function () {
  before(function () {
    findOneStub = sinon.stub(User, 'findOne')

    sessions = proxyquire('../../routes/sessions', { '../models/user': {
      findOne: findOneStub
    }})
  })

  after(function () {
    User.findOne.restore()
  })

  it('should export all the required functions', function () {
    sessions.should.respondTo('signUpPage')
    sessions.should.respondTo('signUpSubmit')
    sessions.should.respondTo('logInPage')
    sessions.should.respondTo('logOut')
  })

  it('should handle the signUpPage', function (done) {
    const req = {}

    const res = {
      locals: {},
      render: function (template, data) {
        template.should.equal('sign-up')
        data.data.should.deep.equal({})
        done()
      }
    }
    sessions.signUpPage(req, res)
  })


/////need help with this one
  xdescribe('should handle the signUpSubmit function', function (done) {
    const req = {
      body: {
        email: 'sally@test.com',
        firstName: 'sally',
        lastName: 'd',
        password: 'unicorns1'
      }
    }

    it('with user email already taken error', function (done) {
      const res = {
        locals: {},
        render: function(template, data) {
          // data???
          template.should.equal('sign-up')
          done()
        }
      }

      sessions.signUpSubmit(req, res)
    })

    it('with password and passwordConfirm not equal error', function (done) {
      const res = {
        locals: {},
        render: function(template, data) {
          // data???
          template.should.equal('sign-up')
          done()
        }
      }

      sessions.signUpSubmit(req, res)
    })

    it('with valid form submission', function (done) {
      //User.create()

      sessions.signUpSubmit(req, res)
    })

    it('with a model validation error', function (done) {
      //User.create() error -- validation errors


      sessions.signUpSubmit(req, res)
    })

    it('with a non-validation model error', function (done) {
      //User.create() error -- validation errors


      sessions.signUpSubmit(req, res)
    })

  })

  it('should handle the logInPage', function (done) {
    const res = {
      locals: {},
      render: function (template, data) {
        template.should.equal('log-in')
        data.should.deep.equal({})
        done()
      }
    }
    sessions.logInPage(null, res)
  })

  it('should handle the logOut function', function (done) {
    const flashSpy = sinon.spy()
    const logoutSpy = sinon.spy()

    const req = {
      logout: logoutSpy,
      flash: flashSpy
    }

    const res = {
      redirect: function (path) {
        logoutSpy.should.have.been.calledOnce
        flashSpy.should.have.been.calledOnce
        flashSpy.should.have.been.calledWith('success', 'You have been logged out.')
        path.should.equal('/')
        done()
      }
    }
    sessions.logOut(req, res)
  })

})
