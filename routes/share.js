const Dress = require('../models/dress')

exports.listPage = function (req, res) {
  // setup sort
  let sort = {rating: -1}
  res.locals.sort = 'rating'
  if(req.query.sort === 'price') {
    sort = {price: 1}
    res.locals.sort = 'price'
  }
  if(req.query.sort === 'designer') {
    sort = {designer: 1}
    res.locals.sort = 'designer'
  }

  // setup view
  res.locals.view = 'front'
  if (req.query.view === 'back') {
    res.locals.view = 'back'
  }
  if (req.query.view === 'side') {
    res.locals.view = 'side'
  }

  // get all dresses for the user
  Dress.find({user:req.params.userID})
    .sort(sort)
    .then(dresses => {
      if(dresses.length === 0) {
        res.redirect('/dresses/add')
      } else {
        // save dresses to res.locals
        res.locals.dresses = dresses
        // show the list of dresses page
        res.render('dresses', res.locals)
      }
    })
}


exports.readPage = function (req, res) {
  // find dress using userID and dress url params
  Dress.findOne({user:req.params.userID, _id:req.params.dress})
  .then(dress => {
    console.log(dress)
    if(!dress) {
      res.send('error, no dress found')
    }
    // set locals.dress to dress data
    res.locals.dress = dress
    // show the dress page
    res.render('dress', res.locals)
  })
}


//
// exports.comparePage = function (req, res) {
//   // get ids of both dresses and find dress data
//   let idA = req.query.dressA
//   let idB = req.query.dressB
//   // find the two dresses
//   Dress.find({user:req.user._id, _id: {$in: [idA, idB]}})
//
//     .then(dresses => {
//       if(dresses.length === 0) {
//         res.send('dresses not found')
//       } else {
//         // save data in res.locals so it can be accessed
//         res.locals.dressA = dresses[0]
//         res.locals.dressB = dresses[1]
//         // show the comare page
//         res.render('compare', res.locals)
//       }
//       //added this .catch, not sure if its right
//     }).catch(err => next(err))
// }
