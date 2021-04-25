const mongoose = require('mongoose')
const Customer = require('./Customer.model')
const Schema = mongoose.Schema


const reviewSchema = new Schema({
  _id: mongoose.Types.ObjectId,
  title: String,
  content: String,
  ratingPoint: Number,
  customerId: {type: mongoose.Types.ObjectId, ref: Customer}
})

const Review = mongoose.model('Review', reviewSchema, 'reviews')

module.exports = Review