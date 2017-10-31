const mongoose = require('mongoose')
const numeral = require('numeral')

// setup schema
const dressSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true,
    required: true
  },
  imgFront: {
    type: String,
    required: [true, 'front of dress photo is required']
  },
  imgBack: String,
  imgSide: String,
  rating: {
    type: Number,
    required: [true, 'rating is required']
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
  // return the price as undefined if NaN or return the integer
  return isNaN(priceFloat) ? undefined : priceFloat
}

// price: convert number to price format $1,111
function toPrice (price) {
  // if no price, return undefined
  if (!price) {
    return undefined
  }
  return numeral(price).format('$ 0,0[.]00')
}

// mongoose model for Dress
const Dress = mongoose.model('Dress', dressSchema)

// export Dress model
module.exports = Dress
