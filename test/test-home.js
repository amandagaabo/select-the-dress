// const chai = require('chai')
// const chaiHttp = require('chai-http')
//
// const should = chai.should()
// const {app, runServer, closeServer} = require('../server')
// const {TEST_DATABASE_URL} = require('../config/config')
//
// chai.use(chaiHttp)
//
// describe('home route', function () {
//   // hook functions
//   before(function () {
//     return runServer(TEST_DATABASE_URL)
//   })
//
//   after(function () {
//     return closeServer()
//   })
//
//   describe('GET request to / ', function () {
//     it('should return home page html', function () {
//       return chai.request(app)
//       .get('/')
//       .then(res => {
//         res.should.have.status(200)
//         res.should.be.html
//         res.text.should.include('home')
//         return Promise.resolve()
//       })
//     })
//   })
// })
