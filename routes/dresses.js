
exports.listPage = function (req, res) {
  // show the list of dresses page
  res.render('dresses')
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
