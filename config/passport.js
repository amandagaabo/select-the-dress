const LocalStrategy = require('passport-local').Strategy
const User = require('../models/user')

// expose this function to the app using module.exports
module.exports = function(app, passport) {
  app.use(passport.initialize())
  // persistent login sessions
  app.use(passport.session())

  // used to serialize the user for the session -- tells it what to save in the session, id is saved here
    passport.serializeUser(function(user, done) {
      done(null, user._id)
    })

    // used to deserialize the user -- on each request user is added to req.user here
    passport.deserializeUser(function(_id, done) {

      User.findById(_id, function(err, user) {
        done(err, user)
      })
    })

    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
      },
      function(email, password, done) {
        User.findOne({ email: email.toLowerCase() })
          .then(user => {
            if (!user) {
              return done(null, false, { message: 'incorrect username or password' })
            }

            user.matchPassword(password)
              .then(success => {
                if (!success) {
                  done(null, false, { message: 'incorrect username or password' })
                } else {
                  done(null, user)
                }
              })
          })
          .catch(err => done(err))
      }
    ))
}
