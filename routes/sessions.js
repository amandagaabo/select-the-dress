const User = require('../models/user')

exports.signUpPage = function (req, res) {
  // set res.locals.data to empty on page render
  res.locals.data = {}
  // show the sign up page
  res.render('sign-up', res.locals)
}

exports.signUpSubmit = function (req, res) {
  // get data from request
  const data = {
    email: req.body.email,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    password: req.body.password
  }

  // save data to res.locals so info can be prefilled if there are errors
  res.locals.data = req.body

  // additional validation that is not done in user model
  const errors = []
  const fields = []

  // email: check that email is not already in the database
  User.findOne({ email: req.body.email.toLowerCase() })
  .then(user => {
    if (user) {
      errors.push('This email address is already taken.')
      fields.push('email')
    }

    // password: check that password and passwordConfirm match
    // no access to passwordConfrim in user model so it needs to be checked here
    if (req.body.password !== req.body.passwordConfirm) {
      errors.push(`Your passwords didn't match.`)
      fields.push('password')
    }

    // if there are errors, save them to locals.messages along with the error field and return a redirect to exit this function
    if (errors.length > 0) {
      res.locals.messages.errors = errors
      res.locals.messages.errorFields = fields
      return res.status(422).render('sign-up', res.locals)
    }

    // if no errors, add user to database
    User.create(data)
    .then((user) => {
      // redirect to add dresses since user is new and has no dresses to display
      req.login(user, function () {
        req.flash('success', 'Welcome! Add a dress to get started.')
        return res.redirect('/dresses/add')
      })
    }).catch(err => {
      if (err.name === 'ValidationError') {
        for (let field in err.errors) {
          errors.push(err.errors[field].message)
          fields.push(field)
        }
        res.locals.messages.errors = errors
        res.locals.messages.errorFields = fields
      } else {
        res.locals.messages.errors = ['Some other error happened. You should tell Amanda.']
      }
      res.status(422).render('sign-up', res.locals)
    })
  })
}

exports.logInPage = function (req, res) {
  // render log in page
  res.render('log-in', res.locals)
}

exports.logOut = function (req, res) {
  // log out
  req.logout()
  // redirect to home and send message
  req.flash('success', 'You have been logged out.')
  res.redirect('/')
}
