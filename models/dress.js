const mongoose = require('mongoose')
const validator = require('validator')
const numeral = require('numeral')
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
      set: toNumber,
      get: toPrice
    },
    store: String,
    notes: String
})

// price: convert user input to number including decimals
function toNumber (price) {
  // remove $ , and letters
  let cleanedPrice = price.replace(/[^\d.-]/g, '')
  // convert to integer with 2 decimal places
  let priceFloat = parseFloat(cleanedPrice)
  // save the price as the integer or undefined if NaN
  let savePrice = priceFloat
  if (isNaN(priceFloat)) {
    savePrice = undefined
  }

  // return price as a number
  return savePrice
}

// price: convert number to price $1,111
function toPrice(price) {
  // if no price, return undefined
  if(!price) {
    return undefined
  }
  return numeral(price).format('$ 0,0[.]00')
}

// mongoose model for Dress
const Dress = mongoose.model('Dress', dressSchema)

// export User model
module.exports = Dress
