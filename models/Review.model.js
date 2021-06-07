const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Book = require('./Book.model')

const Photo = require('./Photo.model')


const reviewSchema = new Schema({
  _id: mongoose.Types.ObjectId,
  title: String,
  content: String,
  ratingPoint: Number,
  storeId: String,
  customerId: String,
  createdDate: {type: Date, default: Date.now()},
  photos: [{type: mongoose.Types.ObjectId, ref: Photo}],
  book: {type: mongoose.Types.ObjectId, ref: Book}
})

const Review = mongoose.model('Review', reviewSchema, 'reviews')

module.exports = Review