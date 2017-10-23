const User = require('../models/user')

exports.signUpPage = function (req, res) {
  // show the sign up page
  //res.locals.success = req.flash('signupPageMessage')
  res.render('sign-up', res.locals)
}

exports.signUpSubmit = function (req, res) {
  // create the new user in database
  const data = {
    email: req.body.email,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    password: req.body.password
  }
  // add user to database
  User.create(data)
  // redirect to add dresses since user is new and has no dresses to display
  .then(() => {
    //res.locals.success = req.flash('sighUpSuccessMessage')
    req.login()
    res.redirect('/dresses/add')
  }).catch(err => console.log(err))
}

exports.logInPage = function (req, res) {
  // show the log in page
  //res.locals.success = req.flash('loginPageMessage')
  res.render('log-in', res.locals)
}


exports.logOut = function (req, res) {
  // log out]
  req.logout()
  // redirect to home
  res.redirect('/')
}
