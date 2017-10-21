const mongoose = require('mongoose')

// setup schema for posts
const dressSchema = mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true, required: true},
    imgFront: {
      src: {type: String, required: true},
      alt: {type: String, required: true}
    },
    imgBack: {
      src: String,
      alt: String
    },
    imgSide: {
      src: String,
      alt: String
    },
    rating: {type: Number, required: true},
    designer: String,
    style: String,
    price: Number,
    store: String,
    notes: String
})

// mongoose model for Dress
const Dress = mongoose.model('Dress', dressSchema)

// export User model
module.exports = Dress
