const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Photo = require('./Photo.model')
const Book = require('./Book.model')



const reviewSchema = new Schema({
  _id: mongoose.Types.ObjectId,
  title: String,
  content: String,
  ratingPoint: Number,
  storeId: String,
  customerId: String,
  book: { type: mongoose.Types.ObjectId, ref: Book },
  createdDate: {type: Date, default: Date.now()},
  photos: [{type: mongoose.Types.ObjectId, ref: Photo}],
})

const Review = mongoose.model('Review', reviewSchema, 'reviews')

module.exports = Review