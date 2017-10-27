const chai = require('chai')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
const should = chai.should()
chai.use(sinonChai)
const proxyquire = require('proxyquire')
const Dress = require('../../models/dress')

let dresses
let findStub
let findOneStub

describe('The dresses route', function () {
  before(function () {
    createStub = sinon.stub(Dress, 'create')
    findOneStub = sinon.stub(Dress, 'findOne')
    findStub = sinon.stub(Dress, 'find')

    dresses = proxyquire('../../routes/dresses', { '../models/dress': {
      create: createStub,
      findOne: findOneStub,
      find: findStub
    }})
  })

  after(function () {
    Dress.create.restore()
    Dress.findOne.restore()
    Dress.find.restore()
  })

  it('should export all the required functions', function () {
    dresses.should.respondTo('loadDress')
    dresses.should.respondTo('listPage')
    dresses.should.respondTo('addPage')
    dresses.should.respondTo('create')
    dresses.should.respondTo('readPage')
    dresses.should.respondTo('editPage')
    dresses.should.respondTo('update')
    dresses.should.respondTo('delete')
    dresses.should.respondTo('comparePage')
  })

  describe('should handle loadDress', function () {
    const req = {
      user: { _id: '123' },
      params: { dress: 'abc' }
    }

    it('with no dress found', function (done) {
      findOneStub.resolves(null)

      const res = {
        send: function (message) {
          message.should.equal('error, no dress found')
          done()
        }
      }

      dresses.loadDress(req, res)
    })

    it('with a model error', function (done) {
      findOneStub.rejects(new Error('Yikes!'))

      const next = function (err) {
        err.should.exist
        done()
      }

      dresses.loadDress(req, null, next)
    })

    it('with a dress found', function (done) {
      const dress = { _id: '123', price: 1400 }

      findOneStub.resolves(dress)

      const next = function (err) {
        should.equal(err, undefined)
        req.dress.should.equal(dress)
        done()
      }

      dresses.loadDress(req, null, next)
    })
  })

  describe('should handle the listPage', function () {
    const req = {
      query: {},
      user: {}
    }

    it('with no dresses', function (done) {
      findStub.returns({
        sort: sinon.stub().resolves([])
      })

      const res = {
        locals: {},
        redirect: function (path) {
          path.should.equal('/dresses/add')
          done()
        }
      }

      dresses.listPage(req, res)
    })

    describe('with dresses', function () {
      const result = [
        { _id: 'abc' },
        { _id: 'xyz' }
      ]

      it('and no sort specified', function (done) {
        findStub.returns({
          sort: function (sort) {
            sort.should.have.property('rating')
            sort.rating.should.equal(-1)
            return Promise.resolve(result)
          }
        })

        const res = {
          locals: {},
          render: function (template, locals) {
            locals.dresses.should.equal(result)
            locals.sort.should.equal('rating')
            locals.view.should.equal('front')
            template.should.equal('dresses')
            done()
          }
        }

        dresses.listPage(req, res)
      })

      it('and sort by price specified', function (done) {
        findStub.returns({
          sort: function (sort) {
            sort.should.have.property('price')
            sort.price.should.equal(1)
            return Promise.resolve(result)
          }
        })

        req.query = { sort: 'price' }

        const res = {
          locals: {},
          render: function (template, locals) {
            locals.dresses.should.equal(result)
            locals.sort.should.equal('price')
            locals.view.should.equal('front')
            template.should.equal('dresses')
            done()
          }
        }

        dresses.listPage(req, res)
      })

      it('and sort by designer specified', function (done) {
        findStub.returns({
          sort: function (sort) {
            sort.should.have.property('designer')
            sort.designer.should.equal(1)
            return Promise.resolve(result)
          }
        })

        req.query = { sort: 'designer' }

        const res = {
          locals: {},
          render: function (template, locals) {
            locals.dresses.should.equal(result)
            locals.sort.should.equal('designer')
            locals.view.should.equal('front')
            template.should.equal('dresses')
            done()
          }
        }

        dresses.listPage(req, res)
      })

      it('and an invalid sort specified', function (done) {
        findStub.returns({
          sort: function (sort) {
            sort.should.have.property('rating')
            sort.rating.should.equal(-1)
            return Promise.resolve(result)
          }
        })

        req.query = { sort: 'skin to fabric ratio' }

        const res = {
          locals: {},
          render: function (template, locals) {
            locals.dresses.should.equal(result)
            locals.sort.should.equal('rating')
            locals.view.should.equal('front')
            template.should.equal('dresses')
            done()
          }
        }

        dresses.listPage(req, res)
      })

      it('and view back specified', function (done) {
        findStub.returns({
          sort: sinon.stub().resolves(result)
        })

        req.query = { view: 'back' }

        const res = {
          locals: {},
          render: function (template, locals) {
            locals.dresses.should.equal(result)
            locals.view.should.equal('back')
            template.should.equal('dresses')
            done()
          }
        }

        dresses.listPage(req, res)
      })

      it('and view side specified', function (done) {
        findStub.returns({
          sort: sinon.stub().resolves(result)
        })

        req.query = { view: 'side' }

        const res = {
          locals: {},
          render: function (template, locals) {
            locals.dresses.should.equal(result)
            locals.view.should.equal('side')
            template.should.equal('dresses')
            done()
          }
        }

        dresses.listPage(req, res)
      })

      it('and an invalid view specified', function (done) {
        findStub.returns({
          sort: sinon.stub().resolves(result)
        })

        req.query = { view: 'all the things' }

        const res = {
          locals: {},
          render: function (template, locals) {
            locals.dresses.should.equal(result)
            locals.view.should.equal('front')
            template.should.equal('dresses')
            done()
          }
        }

        dresses.listPage(req, res)
      })
    })
  })

  it('should handle the addPage', function (done) {
    const res = {
      locals: {},
      render: function (template, locals) {
        template.should.equal('add-dress')
        locals.data.should.deep.equal({})
        done()
      }
    }

    dresses.addPage({}, res)
  })

  it('should handle the readPage', function (done) {
    const req = {
      dress: {
        _id: '123',
        designer: 'a',
        style: 'b',
        price: 1200
      }
    }

    const res = {
      locals: {},
      render: function (template, locals) {
        template.should.equal('dress')
        locals.dress.should.equal(req.dress)
        done()
      }
    }

    dresses.readPage(req, res)
  })


  describe('should handle the create function', function () {
    it('and succeed with valid data', function (done) {
      createStub.resolves()

      const flashSpy = sinon.spy()

      const body = {}

      const req = {
        body,
        files: {},
        user: {},
        flash: flashSpy
      }

      const res = {
        locals: {
          messages: {}
        },
        redirect: function (path) {
          path.should.equal('/dresses')
          flashSpy.should.have.been.calledOnce
          flashSpy.should.have.been.calledWith('success', 'Dress added successfully')
          done()
        }
      }

      dresses.create(req, res)
    })

    it('and fail with validation errors', function (done) {
      const error = {
        name: 'ValidationError',
        errors: {
          password: {
            message: 'Your password sucks'
          }
        }
      }

      createStub.rejects(error)

      const body = {}

      const req = {
        body,
        files: {},
        user: {}
      }

      const res = {
        locals: {
          messages: {}
        },
        render: function (template, locals) {
          locals.data.should.equal(body)
          locals.messages.errors.should.have.length(1)
          locals.messages.errors[0].should.exist
          locals.messages.errorFields.should.have.length(1)
          locals.messages.errorFields[0].should.equal('password')
          template.should.equal('add-dress')
          done()
        }
      }

      dresses.create(req, res)
    })

    it('and fail with a non-validation error', function (done) {
      const error = {
        name: 'SomeOtherError'
      }

      createStub.rejects(error)
      const body = {}
      const req = {
        body,
        files: {},
        user: {}
      }

      const res = {
        locals: {
          messages: {}
        },
        render: function (template, locals) {
          locals.messages.errors.should.have.length(1)
          should.not.exist(locals.messages.errorFields)
          locals.data.should.equal(body)
          template.should.equal('add-dress')
          done()
        }
      }

      dresses.create(req, res)
    })
  })


  it('should handle the delete function', function (done) {
    // use spy to make sure flash function runs
    const flashSpy = sinon.spy()

    const req = {
      dress: {
        remove: sinon.stub().resolves()
      },
      flash: flashSpy
    }

    const res = {
      locals: {},
      send: function (message) {
        message.should.equal('OK')
        flashSpy.should.have.been.calledOnce
        flashSpy.should.have.been.calledWith('success', 'Dress deleted.')
        done()
      }
    }

    dresses.delete(req, res)
  })


  describe('should handle the update function', function (done) {
    it('and succeed with valid data', function (done) {
      // use a spy to make sure flash function runs
      const flashSpy = sinon.spy()

      const req = {
        body: {},
        user: {},
        dress: {
          save: sinon.stub().resolves()
        },
        flash: flashSpy
      }

      const res = {
        redirect: function (path) {
          path.should.equal(`/dresses/${req.dress._id}`)
          flashSpy.should.have.been.calledOnce
          flashSpy.should.have.been.calledWith('success', 'Dress details saved')
          done()
        }
      }

      dresses.update(req, res)
    })

    it('and fail with validation errors', function (done) {
      const error = {
        name: 'ValidationError',
        errors: {
          price: {
            message: 'invalid price'
          }
        }
      }

      const req = {
        body: {},
        user: {},
        dress: {
          save: sinon.stub().rejects(error)
        }
      }

      const res = {
        locals: {
          messages: {}
        },
        render: function (template, locals) {
          locals.messages.errors.should.have.length(1)
          locals.messages.errors[0].should.exist
          locals.messages.errorFields.should.have.length(1)
          locals.messages.errorFields[0].should.equal('price')
          template.should.equal('add-dress')
          done()
        }
      }

      dresses.update(req, res)
    })

    it('and fail with a non-validation error', function (done) {
      const error = {
        name: 'SomeOtherError'
      }

      const req = {
        body: {},
        user: {},
        dress: {
          save: sinon.stub().rejects(error)
        }
      }

      const res = {
        locals: {
          messages: {}
        },
        render: function (template, locals) {
          locals.messages.errors.should.have.length(1)
          locals.messages.errors[0].should.exist
          should.not.exist(locals.messages.errorFields)
          template.should.equal('add-dress')
          done()
        }
      }

      dresses.update(req, res)
    })
  })

  describe('should handle comparePage', function (done) {
    const req = {
      query: {},
      user: {}
    }

    it('with no dresses found', function (done) {
      const result = []
      findStub.resolves(result)

      const res = {
        send: function (message) {
          message.should.equal('dresses not found')
          done()
        }
      }

      dresses.comparePage(req, res)
    })

    it('with dresses found', function (done) {
      const result = [
        { _id: '123', price: 1400 },
        { _id: '456', price: 1100 }
      ]

      findStub.resolves(result)

      const res = {
        locals: {},
        render: function (template, locals) {
          template.should.equal('compare')
          locals.dressA.should.equal(result[0])
          locals.dressB.should.equal(result[1])
          done()
        }
      }

      dresses.comparePage(req, res)
    })
  })
})
