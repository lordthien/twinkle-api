const mongoose = require('mongoose')
const Customer = require('./Customer.model')
const Schema = mongoose.Schema

const Photo = require('./Photo.model')


const reviewSchema = new Schema({
  _id: mongoose.Types.ObjectId,
  title: String,
  content: String,
  ratingPoint: Number,
  storeId: String,
  createdDate: {type: Date, default: Date.now()},
  customer: {type: mongoose.Types.ObjectId, ref: Customer},
  photos: [{type: mongoose.Types.ObjectId, ref: Photo}],
})

const Review = mongoose.model('Review', reviewSchema, 'reviews')

module.exports = Review