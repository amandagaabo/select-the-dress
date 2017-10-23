const express = require('express')
const router = express.Router()
const cloudinary = require('cloudinary')
const cloudinaryStorage = require('multer-storage-cloudinary')
const multer = require('multer')

const storage = cloudinaryStorage({
  cloudinary: cloudinary,
  folder: 'dresses',
  allowedFormats: ['jpg', 'png', 'jpeg'],
  transformation: [{height: 1500, width: 1000}]
})

const upload = multer({storage})

const sessions = require('./sessions')
const accounts = require('./accounts')
const dresses = require('./dresses')

module.exports = function (passport) {
  router.get('/', function (req, res) {
    res.render('home', res.locals)
  })

  // middleware to check if user is logged in
  function isLoggedIn(req, res, next) {
    // if user is authenticated in the session then req.user exists
    if (req.user) {
      return next()
    }
    // if user is not authenticated then redirect to login
    res.redirect('/log-in')
  }

  // session related routes
  router.get('/sign-up', sessions.signUpPage)
  router.post('/sign-up', sessions.signUpSubmit)
  router.get('/log-in', sessions.logInPage)
  router.post('/log-in',  passport.authenticate('local', {
    successRedirect: '/dresses',
    failureRedirect: '/log-in',
    failureFlash: false }))
  router.get('/log-out', sessions.logOut)

  // account related routes
  router.get('/account', isLoggedIn, accounts.loadUser, accounts.readPage)
  router.get('/account/edit', isLoggedIn, accounts.loadUser, accounts.editPage)
  router.post('/account/edit', isLoggedIn, accounts.loadUser, accounts.update)

  // dress related routes
  // image uploader
  const uploader = upload.fields([{ name: 'imgFront', maxCount: 1 }, { name: 'imgBack', maxCount: 1 }, { name: 'imgSide', maxCount: 1 }])
  router.get('/dresses', isLoggedIn, dresses.listPage)
  router.get('/dresses/add', isLoggedIn, dresses.addPage)
  router.post('/dresses/add', isLoggedIn, uploader, dresses.create)
  router.get('/dresses/compare', isLoggedIn, dresses.comparePage)
  router.get('/dresses/:dress', isLoggedIn, dresses.loadDress, dresses.readPage)
  router.get('/dresses/:dress/edit', isLoggedIn, dresses.loadDress, dresses.editPage)
  // form submit can only handle get and post so setup update and delete like this:
  router.post('/dresses/:dress/edit', isLoggedIn, dresses.loadDress, dresses.update)
  router.post('/dresses/:dress/delete', isLoggedIn, dresses.loadDress, dresses.delete)

  // not using these, alternate way to request update and delete requests, would require AJAX requests
  // router.put('/dresses/:dress', dresses.update)
  // router.delete('/dresses/:dress', dresses.delete)

  return router;
}
