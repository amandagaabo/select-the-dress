const LocalStrategy = require('passport-local').Strategy
const User = require('../models/user')

// expose this function to the app using module.exports

module.exports = function(app, passport) {
  app.use(passport.initialize())
  // persistent login sessions
  app.use(passport.session())

  // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
      done(null, user._id)
    })

    // used to deserialize the user
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
        User.findOne({ email: email })
          .then(user => {
            if (!user) {
              return done(null, false, { message: 'Incorrect username.' });
            }

            user.validPassword(password)
              .then(success => {
                if (!success) {
                  done(null, false, { message: 'Incorrect password.' });
                } else {
                  done(null, user);
                }
              })
          })
          .catch(err => done(err))
      }
    ));
}
