const express = require('express')
const router = express.Router()

const sessions = require('./sessions')
const accounts = require('./accounts')
const dresses = require('./dresses')

router.get('/', function (req, res) {
  res.render('home')
})

// session related routes
router.get('/sign-up', sessions.signUpPage)
router.post('/sign-up', sessions.signUpSubmit)
router.get('/log-in', sessions.logInPage)
router.post('/log-in', sessions.logInSubmit)
router.get('/log-out', sessions.logOut)

// account related routes
router.get('/account', accounts.readPage)
router.get('/account/edit', accounts.editPage)
router.post('/account/edit', accounts.update)

// dress related routes
router.get('/dresses', dresses.listPage)
router.get('/dresses/add', dresses.addPage)
router.post('/dresses/add', dresses.create)
router.get('/dresses/compare', dresses.comparePage)
router.get('/dresses/:dress', dresses.readPage)
router.get('/dresses/:dress/edit', dresses.editPage)
// form submit can only handle get and post so setup update and delete like this:
router.post('/dresses/:dress/edit', dresses.update)
router.post('/dresses/:dress/delete', dresses.delete)

// not using these, alternate way to request update and delete requests, would require AJAX requests
// router.put('/dresses/:dress', dresses.update)
// router.delete('/dresses/:dress', dresses.delete)

module.exports = router
