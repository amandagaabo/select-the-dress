const Dress = require('../models/dress')
const _ = require('lodash')
const {BASE_URL} = require('../config/config')

// middleware to find one dress
exports.loadDress = function (req, res, next) {
  // find the dress in the database using user id and dress id
  Dress.findOne({user: req.user._id, _id: req.params.dress})
  .then(dress => {
    if (!dress) {
      res.send('error, no dress found')
    } else {
      // set locals.dress to dress data
      req.dress = dress
      next()
    }
  }).catch(err => next(err))
}

exports.listPage = function (req, res) {
  // setup sort, default to rating
  let sort = {rating: -1}
  res.locals.sort = 'rating'
  if (req.query.sort === 'price') {
    sort = {price: 1}
    res.locals.sort = 'price'
  }
  if (req.query.sort === 'designer') {
    sort = {designer: 1}
    res.locals.sort = 'designer'
  }

  // setup view, default to front
  res.locals.view = 'front'
  if (req.query.view === 'back') {
    res.locals.view = 'back'
  }
  if (req.query.view === 'side') {
    res.locals.view = 'side'
  }

  // get all dresses for the user, sort by sort field and render dresses page
  Dress.find({user: req.user._id})
  .sort(sort)
  .then(dresses => {
    if (dresses.length === 0) {
      res.redirect('/dresses/add')
    } else {
      // save dresses to res.locals
      res.locals.dresses = dresses
      // save base url to res.locals for share link
      res.locals.url = BASE_URL
      // render the list of dresses page
      res.render('dresses', res.locals)
    }
  })
}

exports.addPage = function (req, res) {
  // set res.locals.data to empty on page render, will be used if there are errors submitting the form
  res.locals.data = {}
  // render the add dress page
  res.render('add-dress', res.locals)
}

exports.create = function (req, res) {
  // get data from request and save to a new variable
  const data = {
    user: req.user._id,
    imgFront: _.get(req.files, 'imgFront[0].secure_url', undefined),
    imgBack: _.get(req.files, 'imgBack[0].secure_url', ['https://dummyimage.com/400x600/a38ea3/ffffff.jpg&text=back+of+dress+not+uploaded']),
    imgSide: _.get(req.files, 'imgSide[0].secure_url', ['https://dummyimage.com/400x600/a38ea3/ffffff.jpg&text=side+of+dress+not+uploaded']),
    rating: req.body.rating,
    designer: req.body.designer,
    style: req.body.style,
    price: req.body.price,
    store: req.body.store,
    notes: req.body.notes
  }

  // save request data to res.locals so info can be prefilled if there are errors
  res.locals.data = req.body

  // add dress to the database
  Dress.create(data)
  .then(() => {
    req.flash('success', 'Dress added successfully')
    res.redirect('/dresses')
  }).catch(err => {
    const errors = []
    const fields = []

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
    res.status(422).render('add-dress', res.locals)
  })
}

exports.readPage = function (req, res) {
  // set locals.dress to dress data
  res.locals.dress = req.dress
  // render the dress page
  res.render('dress', res.locals)
}

exports.editPage = function (req, res) {
  // set locals.dress to dress data
  res.locals.dress = req.dress
  // render the edit dress page
  res.render('dress-edit', res.locals)
}

exports.update = function (req, res) {
  // update req.dress with new parameters in req.body
  req.dress.rating = req.body.rating
  req.dress.designer = req.body.designer
  req.dress.style = req.body.style
  req.dress.price = req.body.price
  req.dress.notes = req.body.notes

  // save new dress parameters to database
  req.dress.save()
  .then(() => {
    // redirect to dress page
    req.flash('success', 'Dress details saved')
    res.redirect(`/dresses/${req.dress._id}`)
  }).catch(err => {
    const errors = []
    const fields = []

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
    res.status(422).render('add-dress', res.locals)
  })
}

exports.updateRating = function (req, res) {
  // set req.dress to the req.body rating
  req.dress.rating = req.body.rating
  // save dress rating to database
  req.dress.save()
  .then(() => {
    res.send('OK')
  })
}

exports.delete = function (req, res) {
  req.dress.remove()
  .then(() => {
    req.flash('success', 'Dress deleted.')
    res.send('OK')
  })
}

exports.comparePage = function (req, res) {
  // get ids of both dresses and find dress data
  let idA = req.query.dressA
  let idB = req.query.dressB

  // find the two dresses using user id and the two dress ids
  Dress.find({user: req.user._id, _id: {$in: [idA, idB]}})
  .then(dresses => {
    if (dresses.length === 0) {
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
