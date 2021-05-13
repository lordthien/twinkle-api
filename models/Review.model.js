const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Photo = require('./Photo.model')


const reviewSchema = new Schema({
  _id: mongoose.Types.ObjectId,
  title: String,
  content: String,
  ratingPoint: Number,
  customerId: String,
  storeId: String,
  createdDate: {type: Date, default: Date.now()},
  photos: [{type: mongoose.Types.ObjectId, ref: Photo}],
})

const Review = mongoose.model('Review', reviewSchema, 'reviews')

module.exports = Review