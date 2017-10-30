const chai = require('chai')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
const should = chai.should()
chai.use(sinonChai)
const proxyquire = require('proxyquire')
const User = require('../../models/user')

let sessions
let findOneStub

describe('The sessions route', function () {
  before(function () {
    findOneStub = sinon.stub(User, 'findOne')
    createStub = sinon.stub(User, 'create')

    sessions = proxyquire('../../routes/sessions', { '../models/user': {
      findOne: findOneStub,
      create: createStub
    }})
  })

  after(function () {
    User.findOne.restore()
    User.create.restore()
  })

  it('should export all the required functions', function () {
    sessions.should.respondTo('signUpPage')
    sessions.should.respondTo('signUpSubmit')
    sessions.should.respondTo('logInPage')
    sessions.should.respondTo('logOut')
  })

  it('should handle signUpPage', function (done) {
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

  describe('should handle the signUpSubmit function', function (done) {
    it('and fail if user email is already taken', function (done) {
      const body = {
        firstName: 'jill',
        email: 'jill@test.com'
      }

      const req = {
        body
      }

      const user = {
        firstName: 'jill',
        email: 'jill@test.com'
      }

      findOneStub.resolves(user)

      const res = {
        locals: {
          messages: {}
        },
        status: function (code) {
          code.should.equal(422)

          return {
            render: function (template, locals) {
              locals.data.should.equal(body)
              locals.messages.errors.should.have.length(1)
              locals.messages.errors[0].should.exist
              locals.messages.errorFields.should.have.length(1)
              locals.messages.errorFields[0].should.equal('email')
              template.should.equal('sign-up')
              done()
            }
          }
        }
      }

      sessions.signUpSubmit(req, res)
    })

    it('and fail with password and passwordConfirm not equal', function (done) {
      const body = {
        email: 'jill@test.com',
        password: 'password1',
        passwordConfirm: 'password2'
      }

      const req = {
        body
      }

      findOneStub.resolves(null)

      const res = {
        locals: {
          messages: {}
        },
        status: function (code) {
          code.should.equal(422)

          return {
            render: function (template, locals) {
              locals.data.should.equal(body)
              locals.messages.errors.should.have.length(1)
              locals.messages.errors[0].should.exist
              locals.messages.errorFields.should.have.length(1)
              locals.messages.errorFields[0].should.equal('password')
              template.should.equal('sign-up')
              done()
            }
          }
        }
      }

      sessions.signUpSubmit(req, res)
    })

    it('and succeed with valid form submission', function (done) {
      const flashSpy = sinon.spy()

      const body = {
        email: 'jill@test.com',
        password: 'password1',
        passwordConfirm: 'password1'
      }

      const req = {
        body,
        flash: flashSpy,
        login: function (user, callback) {
          user.should.exist
          callback()
        }
      }

      findOneStub.resolves(null)

      const user = {
        _id: '123',
        email: 'jill@test.com'
      }

      createStub.resolves(user)

      const res = {
        locals: {
          messages: {}
        },
        redirect: function(path) {
          path.should.equal('/dresses/add')
          flashSpy.should.have.been.calledOnce
          flashSpy.should.have.been.calledWith('success', 'Welcome! Add a dress to get started.')
          done()
        }
      }

      sessions.signUpSubmit(req, res)
    })

    it('and fail with a validation error', function (done) {
      const error = {
        name: 'ValidationError',
        errors: {
          password: {
            message: 'password not long enough'
          }
        }
      }

      const body = {
        email: 'jill@test.com',
        password: 'jill1',
        passwordConfirm: 'jill1'
      }

      const req = {
        body
      }

      findOneStub.resolves(null)
      createStub.rejects(error)


      const res = {
        locals: {
          messages: {}
        },
        status: function (code) {
          code.should.equal(422)

          return {
            render: function (template, locals) {
              locals.messages.errors.should.have.length(1)
              locals.messages.errors[0].should.exist
              locals.messages.errorFields.should.have.length(1)
              locals.messages.errorFields[0].should.equal('password')
              template.should.equal('sign-up')
              done()
            }
          }
        }
      }

      sessions.signUpSubmit(req, res)
    })

    it('and fail with a non-validation error', function (done) {
      const error = {
        name: 'SomeOtherError'
      }

      const body = {
        email: 'jill@test.com',
        password: 'jill1',
        passwordConfirm: 'jill1'
      }

      const req = {
        body
      }

      findOneStub.resolves(null)
      createStub.rejects(error)


      const res = {
        locals: {
          messages: {}
        },
        status: function (code) {
          code.should.equal(422)

          return {
            render: function (template, locals) {
              locals.messages.errors.should.have.length(1)
              locals.messages.errors[0].should.exist
              should.not.exist(locals.messages.errorFields)
              template.should.equal('sign-up')
              done()
            }
          }
        }
      }

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
