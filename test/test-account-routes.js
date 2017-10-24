// const {app, runServer, closeServer} = require('../server')
// const {TEST_DATABASE_URL} = require('../config/config')
// const chai = require('chai')
// const chaiHttp = require('chai-http')
// const should = chai.should()
// const request = require('supertest')
// const mongoose = require('mongoose')
// const User = require('../models/user')
// const faker = require('faker')
//
// chai.use(chaiHttp)
//
// // data for a new user that will sign up for an account
// const userData = {
//   email: 'amanda@test.com',
//   firstName: 'Amanda',
//   lastName: 'H',
//   password: 'password1',
//   passwordConfirm: 'password1'
// }
//
// // user credentials for login
// const userCredentials = {
//   email: 'amanda@test.com',
//   password: 'password1'
// }
//
// // setup agent
// let authenticatedUser = request.agent(app)
//
// // function to sign up the user
// function signupUser(done) {
//   console.log('sign up user function running')
//   chai.request(app)
//     .post('/sign-up')
//     .send(userData)
//     .end(function(err, res){
//       console.log('user signup complete')
//       res.should.have.status(302)
//       res.should.redirectTo('/dresses')
//       done()
//     })
// }
//
// // function to login the user
// function loginUser(done) {
//   console.log('loginUser function running')
//   chai.request(app)
//     .post('/log-in')
//     .send(userCredentials)
//     .end(function(err, res){
//       console.log('user login complete')
//       res.should.have.status(302)
//       res.should.redirectTo('/dresses')
//       done()
//     })
// }
//
//
// // clear database
// function clearDB () {
//   console.warn('deleting database')
//   return mongoose.connection.dropDatabase()
// }
//
//
// // test account routes
// // 1. connect to database
// // 2. log the user in
// // 3. access user account page (GET /account)
// // 4. update user account info (POST /account)
// describe('accounts routes', function () {
//   // hook functions
//   before(function (done) {
//     console.log('before hook started')
//     // start server and connect to database
//     runServer(TEST_DATABASE_URL)
//     .then(() => {
//       console.log('call clear db function')
//       return clearDB()
//     })
//     .then(() => {
//       console.log('call signup user function')
//       return signupUser()
//     })
//     .then(() => {
//       console.log('call login user function')
//       return loginUser()
//       done()
//     })
//   })
//
//   after(function () {
//     // close the server
//     return closeServer()
//   })
//
//   describe('GET request to /account', function () {
//     it('should return the account page html', function () {
//       console.log('get request to account started')
//       return authenticatedUser.get('/account')
//       .then(res => {
//         res.should.have.status(200)
//         res.should.be.html
//         res.text.should.include('account')
//       })
//     })
//     // it('should redirect to the log-in page if user is not logged in', function() {
//     //   return chai.request(app)
//     //   .get('/account')
//     //   .then(res => {
//     //     console.log('should redirect')
//     //     res.should.redirectTo('/log-in')
//     //   })
//     // })
//   })
//   // describe('POST request to /account', function () {
//   //   it('should redirect to /account if account update was successful', function () {
//   //     return chai.request(app)
//   //     authenticatedUser.post('/account')
//   //        .type('form')
//   //        .send({
//   //          '_method': 'post',
//   //          'firstName': 'updated first name',
//   //          'lastName': 'updated last name',
//   //          'email': 'new.email@test.com'
//   //        })
//   //      .then(res => {
//   //        res.should.redirect
//   //        res.should.have.status(200)
//   //        res.should.be.html
//   //        res.text.should.include('account')
//   //        return Promise.resolve()
//   //     })
//   //   })
//   // })
// })
