// mock data for development:
const faker = require('faker')
const dresses = []

function createDresses (num) {
  for (let i = 0; i < num; i++) {
    let rating = Math.ceil(Math.random() * 4)
    let newDress = {
      id: faker.random.uuid(),
      user: '123456a',
      img: {
        src: faker.random.image(),
        alt: faker.lorem.words(),
        type: 'front'
      },
      rating: rating,
      designer: faker.lorem.words(),
      styleNum: faker.lorem.words(),
      price: faker.commerce.price(),
      store: 'boulder bridal',
      notes: faker.lorem.sentences()
    }
    dresses.push(newDress)
  }
}

let userDresses = createDresses(10)

exports.listPage = function (req, res) {
  // show the list of dresses page
  res.render('dresses', {dresses: userDresses})
}

exports.addPage = function (req, res) {
  // show the add dress form
  res.render('dress-form')
}

exports.create = function (req, res) {
  // create the new dress, redirect to dresses page if successful & show message
  // res.send('OK')
  res.redirect('/dresses')
}

exports.comparePage = function (req, res) {
  // show the dress comparison page
  res.render('comparison')
}

exports.readPage = function (req, res) {
  // show a single dress page
  res.render('dress')
}

exports.editPage = function (req, res) {
  // show the update dress form page with prefilled data about the selected dress
  res.render('dress-form')
}

exports.update = function (req, res) {
  // update the dress, then rediect to dress page if successful & show message
  // res.send('OK')
  res.redirect('/dresses/:dress')
}

exports.delete = function (req, res) {
  // confirm delete, delete the dress, then rediect to dresses page if successful & show message
  // res.send('OK')
  res.redirect('/dresses')
}
