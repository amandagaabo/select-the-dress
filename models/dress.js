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
      type: String,
      set: toNumber,
      get: num => (num/100).toFixed(2)
    },
    store: String,
    notes: String
})

// validate price: make sure it does not have letters ($ . and , are allowed but not requred)
dressSchema.path('price').validate(price => {
  const isCurrency = /(?=.)^\$?(([1-9][0-9]{0,2}(,[0-9]{3})*)|[0-9]+)?(\.[0-9]{1,2})?$/i
  return isCurrency.test(price)
}, 'price cannot contain letters')

// price: convert user input to number including decimals
function toNumber (price) {
  // remove $ and ,
  let cleanedPrice = price.replace('$', '').replace(',', '')
  // convert to integer with 2 decimal places
  let priceFloat = parseFloat(cleanedPrice).toFixed(2)
  // move decimal and return
  return priceFloat*100
}


// mongoose model for Dress
const Dress = mongoose.model('Dress', dressSchema)

// export User model
module.exports = Dress
