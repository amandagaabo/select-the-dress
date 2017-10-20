// mock data for development:
const userAccount = {
  id: '123456a',
  email: 'jane.smith@gmail.com',
  password: 'hash',
  firstName: 'jane',
  lastName: 'smith'
}

exports.readPage = function (req, res) {
  // show the account page
  res.locals.account = userAccount
  res.render('account', res.locals)
}

exports.editPage = function (req, res) {
  // show the update dress form page
  res.locals.account = userAccount
  res.render('account-edit', res.locals)
}

exports.update = function (req, res) {
  // update the user info in db
  // redirect to account page
  res.redirect('/account')
}
