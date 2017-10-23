const Dress = require('../models/dress')
const _ = require('lodash')

// middleware to find one dress
exports.loadDress = function (req, res, next) {
  // find the dress in the database using dress id and user id
  Dress.findOne({user:req.user._id, _id:req.params.dress})
    .then(dress => {
      if(!dress) {
        res.send('error, no dress found')
      } else {
        // set locals.dress to dress data
        req.dress = dress
        next()
      }
  })
}

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
  Dress.find({user:req.user._id})
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

exports.addPage = function (req, res) {
  // set res.locals.data to empty on page render
  res.locals.data = {}
  // show the add dress form
  res.render('add-dress', res.locals)
}

exports.create = function (req, res) {
  // get data from request
  const data = {
    user: req.user._id,
    imgFront: _.get(req.files, 'imgFront[0].secure_url', ['https://dummyimage.com/400x600/a38ea3/ffffff.jpg&text=front+of+dress+not+uploaded']) ,
    imgBack: _.get(req.files, 'imgBack[0].secure_url', ['https://dummyimage.com/400x600/a38ea3/ffffff.jpg&text=back+of+dress+not+uploaded']),
    imgSide: _.get(req.files, 'imgSide[0].secure_url', ['https://dummyimage.com/400x600/a38ea3/ffffff.jpg&text=side+of+dress+not+uploaded']),
    rating: req.body.rating,
    designer: req.body.designer,
    style: req.body.style,
    price: req.body.price,
    store: req.body.store,
    notes: req.body.notes
  }
  // save data to res.locals so info can be prefilled if there are errors
  res.locals.data = req.body

  // add dress to the database
  Dress.create(data)
  .then(() => {
    req.flash('success', 'Dress added successfully')
    res.redirect('/dresses')
  }).catch(err => {
    console.log(err)
    const errors = []
    const fields = []

    if (err.name == 'ValidationError') {
      for (field in err.errors) {
        errors.push(err.errors[field].message)
        fields.push(field)
      }
      res.locals.messages.errors = errors
      res.locals.messages.errorFields = fields
    } else {
      res.locals.messages.errors = 'Some other error happened. You should tell Amanda.'
    }
    res.render('add-dress', res.locals)
  })
}


exports.readPage = function (req, res) {
  // set locals.dress to dress data
  res.locals.dress = req.dress
  // show the dress page
  res.render('dress', res.locals)
}

exports.editPage = function (req, res) {
  // set locals.dress to dress data
  res.locals.dress = req.dress
  // show the edit dress page
  res.render('dress-edit', res.locals)
}

exports.update = function (req, res) {
  // update with new parameters
  req.dress.rating = req.body.rating
  req.dress.designer = req.body.designer
  req.dress.style = req.body.style
  req.dress.price = req.body.price
  req.dress.notes = req.body.notes

  // save dress parameters to database
  req.dress.save()
  .then(() => {
    // redirect to dress page
    req.flash('success', 'dress details saved')
    res.redirect(`/dresses/${req.dress._id}`)
  }).catch(err => {
    const errors = []
    const fields = []

    if (err.name == 'ValidationError') {
      for (field in err.errors) {
        errors.push(err.errors[field].message)
        fields.push(field)
      }
      res.locals.messages.errors = errors
      res.locals.messages.errorFields = fields
    } else {
      res.locals.messages.errors = 'Some other error happened. You should tell Amanda.'
    }
    res.render('add-dress', res.locals)
  })
}

exports.delete = function (req, res) {
  req.dress.remove()
  .then(() => {
    res.send('OK')
  })
}

exports.comparePage = function (req, res) {
  // get ids of both dresses and find dress data
  let idA = req.query.dressA
  let idB = req.query.dressB
  // find the two dresses
  Dress.find({user:req.user._id, _id: {$in: [idA, idB]}})
    .then(dresses => {
      if(dresses.length === 0) {
        res.send('dresses not found')
      } else {
        // save data in res.locals so it can be accessed
        res.locals.dressA = dresses[0]
        res.locals.dressB = dresses[1]
        // show the comare page
        res.render('compare', res.locals)
      }
    })
}
