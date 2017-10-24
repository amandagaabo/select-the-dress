const mongoose = require('mongoose')
const validator = require('validator')
// add the Currency type to the Mongoose Schema types
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

// setup schema for posts
const dressSchema = mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true,
      required: true
    },
    imgFront: {
      type: String,
      required: [true,'front of dress photo is required']
    },
    imgBack: String,
    imgSide: String,
    rating: {
      type: Number,
      required: [true,'rating is required']
    },
    designer: String,
    style: String,
    price: {
      type: Number,
      set: toNumber
    },
    store: String,
    notes: String
})

// price: convert user input to number including decimals
function toNumber (price) {
  console.log('price input:', price)
  // remove $ , and letters
  let cleanedPrice = price.replace(/[^\d.-]/g, '')
  // convert to integer with 2 decimal places
  console.log('cleaned price', cleanedPrice)
  let priceFloat = parseFloat(cleanedPrice)

  console.log('stored in db', priceFloat)
  // move decimal and return
  return priceFloat || undefined
}

// mongoose model for Dress
const Dress = mongoose.model('Dress', dressSchema)

// export User model
module.exports = Dress
