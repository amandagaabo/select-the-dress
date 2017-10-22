const User = require('../models/user')

// Middleware function used to load one user
exports.loadUser = function (req, res, next) {
  User.findOne({_id:req.user._id})
    .then(user => {
      if(!user) {
        res.send('error, no user found')
      } else {
        req.account = user;
        next();
      }
    })
}

//WITH MIDDLEWARE
exports.readPage = function (req, res) {
  // set locals.account to user data
  res.locals.account = req.account
  // show the account page
  res.render('account', res.locals)
}

exports.editPage = function (req, res) {
  // set locals.account to user data
  res.locals.account = req.account
  // show the account page
  res.render('account-edit', res.locals)
}

exports.update = function (req, res) {
  // update all parameters in database
  req.account.firstName = req.body.firstName
  req.account.lastName = req.body.lastName
  req.account.email = req.body.email

  // save user parameters
  req.account.save()
  .then(() => {
    // redirect to account page
    res.redirect('/account')
  })

}

//NO MIDDLEWARE
// exports.readPage = function (req, res) {
//   // find one user in the dabase
//   User.findOne({_id:req.user._id})
//     .then(user => {
//       if(!user) {
//         res.send('error, no user found')
//       } else {
//         // set locals.account to user data
//         res.locals.account = user
//         // show the account page
//         res.render('account', res.locals)
//       }
//     })
// }
//
// exports.editPage = function (req, res) {
//   // find one user in the dabase
//   User.findOne({_id:req.user._id})
//     .then(user => {
//       if(!user) {
//         res.send('error, no user found')
//       } else {
//         // set locals.account to user data
//         res.locals.account = user
//         // show the update dress form page
//         res.render('account-edit', res.locals)
//       }
//     })
// }
//
// exports.update = function (req, res) {
//   console.log(req.body)
//   User.findOne({_id:req.user._id})
//     .then(user => {
//       if(!user) {
//         res.send('error, no user found')
//       } else {
//         // update all parameters in database
//         user.firstName = req.body.firstName
//         user.lastName = req.body.lastName
//         user.email = req.body.email
//
//         // save user parameters
//         user.save()
//         .then(() => {
//           // redirect to account page
//           res.redirect('/account')
//         })
//       }
//     })
// }
