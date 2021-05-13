const mongoose = require('mongoose')
const Schema = mongoose.Schema


const photoSchema = new Schema({
  _id: mongoose.Types.ObjectId,
  url: String,
  storeId: String,
  reviewId: String,
  createdDate: {type: Date, default: Date.now()},
})

const Photo = mongoose.model('Photo', photoSchema, 'photos')

module.exports = Photo