// mock data for development:
const user = {
  id: '123456a',
  email: 'jane.smith@gmail.com',
  password: 'hash',
  firstName: 'jane',
  lastName: 'smith'
}

exports.readPage = function (req, res) {
  // show the account page
  res.render('account', {user: user})
}

exports.editPage = function (req, res) {
  // show the update dress form page
  res.render('account-edit', {user: user})
}

exports.update = function (req, res) {
  // update the user info in db
  // redirect to account page
  res.redirect('/account')
}
