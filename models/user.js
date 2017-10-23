const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const SALT_WORK_FACTOR = 10;

// setup schema for posts
const userSchema = mongoose.Schema({
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  firstName: {type: String, required: true},
  lastName: {type: String, required: true}
})

// mongoose middleware
userSchema.pre('save', function(next) {
  let user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();

  // hash the password with auto-salter or something
  bcrypt.hash(user.password, SALT_WORK_FACTOR, function(err, hash) {
    if (err) return next(err);

    // override the cleartext password with the hashed one
    user.password = hash;
    next();
  });
});


// setup apiRepr method
userSchema.methods.apiRepr = function () {
  return {
    id: this._id,
    email: this.email,
    firstName: this.firstName,
    lastName: this.lastName
  }
}


// check if password if valid
userSchema.methods.validPassword = function(password) {
  return bcrypt.compare(password, this.password)
}

// mongoose model for User
const User = mongoose.model('User', userSchema)

// export User model
module.exports = User
