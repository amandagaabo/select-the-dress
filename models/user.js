const mongoose = require('mongoose')

// setup schema for posts
const userSchema = mongoose.Schema({
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  firstName: {type: String, required: true},
  lastName: {type: String, required: true}
})

// setup apiRepr method
userSchema.methods.apiRepr = function () {
  return {
    id: this._id,
    email: this.email,
    firstName: this.firstName,
    lastName: this.lastName
  }
}

// mongoose model for User
const User = mongoose.model('User', userSchema)

// export User model
module.exports = User
