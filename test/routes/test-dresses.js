const chai = require('chai')
const should = chai.should()
const proxyquire = require('proxyquire')
const sinon = require('sinon')
const Dress = require('../../models/dress')

let dresses
let findStub
let findOneStub
let removeStub

describe('The dresses route', function () {
  before(function () {
    findStub = sinon.stub(Dress, 'find')
    findOneStub = sinon.stub(Dress, 'findOne')
    //removeStub = sinon.stub(Dress.prototype, 'remove')

    dresses = proxyquire('../../routes/dresses', { '../models/dress': {
      find: findStub,
      findOne: findOneStub
      // prototype: {
      //   remove: removeStub
      // }
    }})
  })

  after(function () {
    Dress.find.restore()
    Dress.findOne.restore()
    //Dress.prototype.remove.restore()
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
        send: function (msg) {
          msg.should.equal('error, no dress found')
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
        should.not.exist(err)
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

          render: function (template, data) {
            data.dresses.should.equal(result)
            data.sort.should.equal('rating')
            data.view.should.equal('front')
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

          render: function (template, data) {
            data.dresses.should.equal(result)
            data.sort.should.equal('price')
            data.view.should.equal('front')
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

          render: function (template, data) {
            data.dresses.should.equal(result)
            data.sort.should.equal('designer')
            data.view.should.equal('front')
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

          render: function (template, data) {
            data.dresses.should.equal(result)
            data.sort.should.equal('rating')
            data.view.should.equal('front')
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

          render: function (template, data) {
            data.dresses.should.equal(result)
            data.view.should.equal('back')
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

          render: function (template, data) {
            data.dresses.should.equal(result)
            data.view.should.equal('side')
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

          render: function (template, data) {
            data.dresses.should.equal(result)
            data.view.should.equal('front')
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
      render: function (template, data) {
        template.should.equal('add-dress')
        data.data.should.deep.equal({})
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
      render: function (template, data) {
        template.should.equal('dress')
        data.dress.should.equal(req.dress)
        done()
      }
    }
    dresses.readPage(req, res)
  })

  xit('should handle the delete function', function (done) {
    const req = {
      dress: {
        _id: '123',
        designer: 'a',
        style: 'b',
        price: 1200
      }
    }

    req.dress.removeStub.resolves(null)

    const res = {
      locals: {},
      send: function (message) {
        message.should.equal('OK')
        done()
      }
    }
    dresses.delete(req, res)
  })

  xit('should handle the update function', function (done) {

  })

  describe('should handle the comparePage', function (done) {
    const req = {
      query: {
        dressA: '123',
        dressB: '456'
      },
      user: {
        _id: '789'
      }
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

    // // not sure how to test for a model error..
    // it('with a model error', function (done) {
    //   findStub.rejects(new Error('Yikes!'))
    //
    //   const next = function (err) {
    //     err.should.exist
    //     done()
    //   }
    //
    //   dresses.comparePage(req, null, next)
    // })

    it('with dresses found', function (done) {
      const result = [
        { _id: '123', price: 1400 },
        {_id: '456', price: 1100 }
      ]

      findStub.resolves(result)

      const res = {
        locals: {},
        render: function (template, data) {
          template.should.equal('compare')
          data.dressA.should.equal(result[0])
          data.dressB.should.equal(result[1])
          done()
        }
      }
      dresses.comparePage(req, res)
    })
  })

})
