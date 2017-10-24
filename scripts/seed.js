// connect to database
require('dotenv').config()
const mongoose = require('mongoose')
const {DATABASE_URL} = require('../config/config')
const User = require('../models/user')
const Dress = require('../models/dress')
// Mongoose internally uses a promise-like object,
// but its better to make Mongoose use built in es6 promises
mongoose.Promise = global.Promise

mongoose.connect(DATABASE_URL, {useMongoClient: true}, err => {
  if (err) {
    throw err
  }
  console.log('connected to database')

// setup data
  const users = [
    {
      email: 'jane.smith@gmail.com',
      password: 'password1',
      firstName: 'jane',
      lastName: 'smith'
    },
    {
      email: 'amanda.herschleb@gmail.com',
      password: 'password1',
      firstName: 'amanda',
      lastName: 'herschleb'
    }
  ]

  const dresses = [
    {
      imgFront: 'http://via.placeholder.com/200x300?text=dress 1 front',
      imgBack: 'http://via.placeholder.com/200x300?text=dress 1 back',
      imgSide: 'http://via.placeholder.com/200x300?text=dress 1 side',
      rating: 4,
      designer: 'maggie sottero',
      style: 'saige',
      price: '$1700',
      store: 'boulder bridal',
      notes: 'love the neckline, lots of lace, beautiful dress'
    },
    {
      imgFront: 'http://via.placeholder.com/200x300?text=dress 2 front',
      imgBack: 'http://via.placeholder.com/200x300?text=dress 2 back',
      imgSide: 'http://via.placeholder.com/200x300?text=dress 2 side',
      rating: 2,
      designer: 'sottero and midgley',
      style: 'elliott',
      price: '$1900',
      store: 'boulder bridal',
      notes: 'the front is too plain, needs more lace and sparkles'
    },
    {
      imgFront: 'http://via.placeholder.com/200x300?text=dress 3 front',
      imgBack: 'http://via.placeholder.com/200x300?text=dress 3 back',
      imgSide: 'http://via.placeholder.com/200x300?text=dress 3 side',
      rating: 1,
      designer: 'casablanca',
      style: 'jessica',
      price: '$1300',
      store: 'boulder bridal',
      notes: 'not even close to what i want'
    },
    {
      imgFront: 'http://via.placeholder.com/200x300?text=dress 4 front',
      imgBack: 'http://via.placeholder.com/200x300?text=dress 4 back',
      imgSide: 'http://via.placeholder.com/200x300?text=dress 4 side',
      rating: 3,
      designer: 'vera wang',
      style: 'jenny',
      price: '$1500',
      store: 'boulder bridal',
      notes: 'very close, love the lacy train'
    },
    {
      imgFront: 'http://via.placeholder.com/200x300?text=dress 5 front',
      imgBack: 'http://via.placeholder.com/200x300?text=dress 5 back',
      imgSide: 'http://via.placeholder.com/200x300?text=dress 5 side',
      rating: 2,
      designer: 'vera wang',
      style: 'sophia',
      price: '$1000',
      store: 'boulder bridal',
      notes: 'love it!'
    }
  ]

// save to database
  // empty User & Dress collections
  User.remove({})
    .then(() => {
      return Dress.remove({})
    })
    .then(() => {
      // add new user
      return User.create(users)
    })
    .then((_users) => {
      const data = dresses.map((dress, index) => {
        if (index < 4) {
          dress.user = _users[0]._id
        } else {
          dress.user = _users[1]._id
        }
        return dress
      })
      // add new dresses
      return Dress.create(data)
    })
    .then(() => {
      console.log('database seeded')
      // exit script, return zero to say it worked with no errors
      process.exit(0)
    })
})
