
exports.signUpPage = function (req, res) {
  // show the sign up page
  res.render('sign-up', res.locals)
}

exports.signUpSubmit = function (req, res) {
  // render sign up page with message if error
  // res.render('sign-up')
  // redirect to dresses if successful
  res.redirect('/dresses')
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
