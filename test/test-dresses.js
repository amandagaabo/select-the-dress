const chai = require('chai')
const chaiHttp = require('chai-http')

const should = chai.should()
const {app, runServer, closeServer} = require('../server')
const {TEST_DATABASE_URL} = require('../config/config')
const Dress = require('../models/dress')
const faker = require('faker')

chai.use(chaiHttp)

// seed data
function seedData () {
  console.info('seeding user data')
  const seedData = []

  for (let i = 1; i <= 5; i++) {
    seedData.push(generateData())
  }
  // this will return a promise
  return User.insertMany(seedData)
}

function generateRating() {
  return Math.ceil(Math.random() * 4)
}

// generate dress with fake data
function generateData () {
  return {
    user: new mongoose.mongo.ObjectId('59ebf98874314249688ae2a1'),
    imgFront: faker.image.imageURL(),
    imgBack: faker.image.imageURL(),
    imgSide: faker.image.imageURL(),
    rating: generateRating(),
    designer: faker.name.firstName(),
    style: faker.name.firstName(),
    price: faker.random.number(),
    store: faker.lorem.word(),
    notes: faker.lorem.sentance()
  }
}

// clear database
function clearDB () {
  console.warn('Deleting database')
  return mongoose.connection.dropDatabase()
}

describe('dresses routes', function () {
  // hook functions
  before(function () {
    return runServer(TEST_DATABASE_URL)
  })

  // beforeEach(function() {
  //   seedData()
  // })
  //
  // afterEach(function () {
  //   return clearDB()
  // })

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

  //// FIX AFTER AUTH IS SET UP ////
  // describe('POST request to /dresses/add ', function () {
  //   it('should redirect to /dresses if dress creation was successful', function () {
  //     return chai.request(app)
  //     .post('/dresses/add')
  //     .then(res => {
  //       res.should.redirect
  //       res.should.have.status(200)
  //       res.should.be.html
  //       res.text.should.include('dresses')
  //       return Promise.resolve()
  //     })
  //   })
  // })
  //
  // describe('GET request to /dresses/compare ', function () {
  //   it('should return comparison page html', function () {
  //     return chai.request(app)
  //     // test comparision ids are used, defined in dresses.js development data
  //     .get(`/dresses/compare?dressA=1575875a&dressB=3575875c`)
  //     .then(res => {
  //       res.should.have.status(200)
  //       res.should.be.html
  //       res.text.should.include('compare')
  //       return Promise.resolve()
  //     })
  //   })
  // })
  //
  // describe('GET request to /dresses/:dress ', function () {
  //   it('should return dress page html', function () {
  //     return chai.request(app)
  //     .get('/dresses/:dress')
  //     .then(res => {
  //       res.should.have.status(200)
  //       res.should.be.html
  //       res.text.should.include('dress')
  //       return Promise.resolve()
  //     })
  //   })
  // })
  //
  // describe('GET request to /dresses/:dress/edit ', function () {
  //   it('should return dress form html', function () {
  //     return chai.request(app)
  //     .get('/dresses/:dress/edit')
  //     .then(res => {
  //       res.should.have.status(200)
  //       res.should.be.html
  //       res.text.should.include('dress-edit')
  //       return Promise.resolve()
  //     })
  //   })
  // })
  //
  // describe('POST request to /dresses/:dress/edit ', function () {
  //   it('should redirect to /:dress if dress update was successful', function () {
  //     return chai.request(app)
  //     .post('/dresses/:dress/edit')
  //     .then(res => {
  //       res.should.redirect
  //       res.should.have.status(200)
  //       res.should.be.html
  //       res.text.should.include('dress')
  //       return Promise.resolve()
  //     })
  //   })
  // })
  //
  // describe('POST request to /dresses/:dress/delete ', function () {
  //   it('should redirect to /dresses if dress deletion was successful', function () {
  //     return chai.request(app)
  //     .post('/dresses/:dress/delete')
  //     .then(res => {
  //       res.should.have.status(200)
  //       res.text.should.include('OK')
  //       return Promise.resolve()
  //     })
  //   })
  // })
})
