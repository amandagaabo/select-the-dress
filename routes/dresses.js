// mock data for development (use aipRepr)
const userDresses = [
  {
    id: '1575875a',
    user: '123456a',
    imgFront: {
      src: 'http://via.placeholder.com/200x300',
      alt: 'dress front'
    },
    imgBack: {
      src: 'http://via.placeholder.com/200x300',
      alt: 'dress back'
    },
    imgSide: {
      src: 'http://via.placeholder.com/200x300',
      alt: 'dress side'
    },
    rating: 4,
    designer: 'maggie sottero',
    style: 'saige',
    price: '$1,700',
    store: 'boulder bridal',
    notes: 'love the neckline, lots of lace, beautiful dress'
  },
  {
    id: '2575875b',
    user: '123456a',
    imgFront: {
      src: 'http://via.placeholder.com/200x300',
      alt: 'dress front'
    },
    imgBack: {
      src: 'http://via.placeholder.com/200x300',
      alt: 'dress back'
    },
    imgSide: {
      src: 'http://via.placeholder.com/200x300',
      alt: 'dress side'
    },
    rating: 2,
    designer: 'sottero and midgley',
    style: 'elliott',
    price: '$1,900',
    store: 'boulder bridal',
    notes: 'the front is too plain, needs more lace and sparkles'
  },
  {
    id: '3575875c',
    user: '123456a',
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
    designer: 'sottero and midgley',
    style: 'jessica',
    price: '$1,300',
    store: 'boulder bridal',
    notes: 'not even close to what i want'
  },
  {
    id: '4575875d',
    user: '123456a',
    imgFront: {
      src: 'http://via.placeholder.com/200x300',
      alt: 'dress front'
    },
    imgBack: {
      src: 'http://via.placeholder.com/200x300',
      alt: 'dress back'
    },
    imgSide: {
      src: 'http://via.placeholder.com/200x300',
      alt: 'dress side'
    },
    rating: 3,
    designer: 'magie sottero',
    style: 'jenny',
    price: '$1,500',
    store: 'boulder bridal',
    notes: 'very close, love the lacy train'
  }
]

exports.listPage = function (req, res) {
  // get all dresses for the user
  // show the list of dresses page
  res.locals.dresses = userDresses
  res.render('dresses', res.locals)
}

exports.addPage = function (req, res) {
  // show the add dress form

  res.render('add-dress', res.locals)
}

exports.create = function (req, res) {
  // create the new dress, redirect to dresses page if successful & show message
  // console.log(req.body)
  // res.send('OK')
  res.redirect('/dresses')
}

exports.comparePage = function (req, res) {
  // get ids of both dresses and find dress data
  let idA = req.query.dressA
  let idB = req.query.dressB
  let dressA = userDresses.find(dress => dress.id === idA)
  let dressB = userDresses.find(dress => dress.id === idB)
  // save data in res.locals so it can be accessed
  res.locals.dressA = dressA
  res.locals.dressB = dressB
  // show the dress comparison page
  res.render('compare', res.locals)
}

exports.readPage = function (req, res) {
  // get dress id from url param
  const dressID = req.params.dress
  let dress = userDresses.find(dress => dress.id === dressID)
  res.locals.dress = dress
  // show a single dress page
  res.render('dress', res.locals)
}

exports.editPage = function (req, res) {
  const dressID = req.params.dress
  let dress = userDresses.find(dress => dress.id === dressID)
  res.locals.dress = dress
  // show the update dress form page with prefilled details
  res.render('dress-edit', res.locals)
}

exports.update = function (req, res) {
  // return to edit dress, fill info and show message if errors
  // res.render('dress-edit')
  // update the dress, then rediect to dress page if successful
  const dressID = req.params.dress
  res.redirect(`/dresses/${dressID}`)
}

exports.delete = function (req, res) {
  // confirm delete, delete the dress, then rediect to dresses page if successful
  console.log('dress deleted')
  res.send('OK')
}
