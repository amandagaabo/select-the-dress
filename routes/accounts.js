exports.readPage = function (req, res) {
  // show the account page
  res.render('account')
}

exports.editPage = function (req, res) {
  // show the update dress form page
  res.render('account-edit')
}

exports.update = function (req, res) {
  // update the user info in db
  // redirect to account page
  res.redirect('/account')
}
