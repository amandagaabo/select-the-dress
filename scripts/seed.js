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
      email: 'amanda@gmail.com',
      password: 'password1',
      firstName: 'amanda',
      lastName: 'h'
    },
    {
      email: 'jane@gmail.com',
      password: 'password1',
      firstName: 'jane',
      lastName: 's'
    }
  ]

  const dresses = [
    {
      imgFront: 'http://res.cloudinary.com/amhprojects/image/upload/v1509386933/dresses/bridal-collection1-front.jpg',
      imgBack: 'http://res.cloudinary.com/amhprojects/image/upload/v1509386926/dresses/bridal-collection1-back.jpg',
      imgSide: 'http://res.cloudinary.com/amhprojects/image/upload/v1509386936/dresses/bridal-collection1-side.jpg',
      rating: 2,
      designer: 'Justin Alexander',
      style: '8602',
      price: '$1525',
      store: 'The Bridal Collection',
      notes: 'Love the beading and fit, don’t like the tulle or petals on the bottom.'
    },
    {
      imgFront: 'http://res.cloudinary.com/amhprojects/image/upload/v1509386927/dresses/bridal-collection2-front.jpg',
      imgBack: 'http://res.cloudinary.com/amhprojects/image/upload/v1509386940/dresses/bridal-collection2-back.jpg',
      imgSide: 'http://res.cloudinary.com/amhprojects/image/upload/v1509386941/dresses/bridal-collection2-side.jpg',
      rating: 3,
      designer: '2 Be Bride',
      style: 'Brielle',
      price: '$1200',
      store: 'The Bridal Collection',
      notes: 'Pretty dress! Little poofy flowers on the bottom can be removed.'
    },
    {
      imgFront: 'http://res.cloudinary.com/amhprojects/image/upload/v1509386946/dresses/bridal-loft-front.jpg',
      imgBack: 'http://res.cloudinary.com/amhprojects/image/upload/v1509386942/dresses/bridal-loft-back.jpg',
      imgSide: 'http://res.cloudinary.com/amhprojects/image/upload/v1509386945/dresses/bridal-loft-side.jpg',
      rating: 4,
      designer: 'Ella Rosa',
      style: 'BE130',
      price: '$1025',
      store: 'The Bridal Loft',
      notes: 'Love the beading on the bodice, corset back, crisscross transition and layered bottom! Reg $1200.'
    },
    {
      imgFront: 'http://res.cloudinary.com/amhprojects/image/upload/v1509388251/dresses/blue-bridal-front-belt.jpg',
      imgBack: 'http://res.cloudinary.com/amhprojects/image/upload/v1509388250/dresses/blue-bridal-back.jpg',
      //imgSide: 'http://res.cloudinary.com/amhprojects/image/upload/v1509388248/dresses/blue-bridal-side.jpg',
      imgSide: 'http://via.placeholder.com/200x300?text=dress 5 side',
      rating: 2,
      designer: 'La Sposa',
      style: 'Sajonia',
      price: '$2300',
      store: 'Blue Bridal Botique',
      notes: 'Crazy bottom, lots going on, kind of plain without a belt. Can buy sample (size 12) for $1100.'
    },
    {
      imgFront: 'http://via.placeholder.com/200x300?text=dress 5 front',
      imgBack: 'http://via.placeholder.com/200x300?text=dress 5 back',
      imgSide: 'http://via.placeholder.com/200x300?text=dress 5 side',
      rating: 3,
      designer: 'vera wang',
      style: 'sophia',
      price: '$1000',
      store: 'boulder bridal',
      notes: 'its close to what I want!'
    }
  ]

// save to database
  // empty database user and dress collections
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
