const User = require('../models/user')

exports.signUpPage = function (req, res) {
  // show the sign up page
  res.render('sign-up', res.locals)
}

exports.signUpSubmit = function (req, res) {
  // check that email is not in database
  if (User.findOne({email:req.body.email})) {
    const message = 'email already exists'
    console.error(message)
    return(res.status(400).json({message}))
  }
  // check passwords match
  if (req.body.password !== req.body.passwordConfirm) {
    const message = 'passwords dont match'
    console.error(message)
    return(res.status(400).json({message}))
  }
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
    res.redirect('/dresses/add')
  })
}

exports.logInPage = function (req, res) {
  // show the log in page
  res.render('log-in', res.locals)
}

exports.logInSubmit = function (req, res) {
  // render log in page with message if error
  // res.render('log-in')
  // redirect to dresses if successful
  res.redirect('/dresses')
}

exports.logOut = function (req, res) {
  // clear session and log out
  // redirect to home
  res.redirect('/')
}
