// connect to database
require('dotenv').config()
const mongoose = require('mongoose')
const {TEST_DATABASE_URL} = require('../config')
const User = require('../models/user')
const Dress = require('../models/dress')
// Mongoose internally uses a promise-like object,
// but its better to make Mongoose use built in es6 promises
mongoose.Promise = global.Promise

mongoose.connect(TEST_DATABASE_URL, {useMongoClient: true}, err => {
  if (err) {
    throw err
  }
  console.log('connected to database')

// setup data
  const users = [
    {
      email: 'jane.smith@gmail.com',
      password: 'hash',
      firstName: 'jane',
      lastName: 'smith'
    },
    {
      email: 'amanda.herschleb@gmail.com',
      password: 'hash',
      firstName: 'amanda',
      lastName: 'herschleb'
    }
  ]

  const dresses = [
    {
      imgFront: {
        src: 'http://via.placeholder.com/200x300?text=dress 1 front',
        alt: 'dress front'
      },
      imgBack: {
        src: 'http://via.placeholder.com/200x300?text=dress 1 back',
        alt: 'dress back'
      },
      imgSide: {
        src: 'http://via.placeholder.com/200x300?text=dress 1 side',
        alt: 'dress side'
      },
      rating: 4,
      designer: 'maggie sottero',
      style: 'saige',
      price: 1700,
      store: 'boulder bridal',
      notes: 'love the neckline, lots of lace, beautiful dress'
    },
    {
      imgFront: {
        src: 'http://via.placeholder.com/200x300?text=dress 2 front',
        alt: 'dress front'
      },
      imgBack: {
        src: 'http://via.placeholder.com/200x300?text=dress 2 back',
        alt: 'dress back'
      },
      imgSide: {
        src: 'http://via.placeholder.com/200x300?text=dress 2 side',
        alt: 'dress side'
      },
      rating: 2,
      designer: 'sottero and midgley',
      style: 'elliott',
      price: 1900,
      store: 'boulder bridal',
      notes: 'the front is too plain, needs more lace and sparkles'
    },
    {
      imgFront: {
        src: 'http://via.placeholder.com/200x300?text=dress 3 front',
        alt: 'dress front'
      },
      imgBack: {
        src: 'http://via.placeholder.com/200x300?text=dress 3 back',
        alt: 'dress back'
      },
      imgSide: {
        src: 'http://via.placeholder.com/200x300?text=dress 3 side',
        alt: 'dress side'
      },
      rating: 1,
      designer: 'casablanca',
      style: 'jessica',
      price: 1300,
      store: 'boulder bridal',
      notes: 'not even close to what i want'
    },
    {
      imgFront: {
        src: 'http://via.placeholder.com/200x300?text=dress 4 front',
        alt: 'dress front'
      },
      imgBack: {
        src: 'http://via.placeholder.com/200x300?text=dress 4 back',
        alt: 'dress back'
      },
      imgSide: {
        src: 'http://via.placeholder.com/200x300?text=dress 4 side',
        alt: 'dress side'
      },
      rating: 3,
      designer: 'vera wang',
      style: 'jenny',
      price: 1500,
      store: 'boulder bridal',
      notes: 'very close, love the lacy train'
    },
    {
      imgFront: {
        src: 'http://via.placeholder.com/200x300?text=dress 5 front',
        alt: 'dress front'
      },
      imgBack: {
        src: 'http://via.placeholder.com/200x300?text=dress 5 back',
        alt: 'dress back'
      },
      imgSide: {
        src: 'http://via.placeholder.com/200x300?text=dress 5 side',
        alt: 'dress side'
      },
      rating: 2,
      designer: 'vera wang',
      style: 'sophia',
      price: 1000,
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
