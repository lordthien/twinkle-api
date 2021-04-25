const mongoose = require('mongoose')
const Store = require('./Store.model')
const Review = require('./Review.model')
const Schema = mongoose.Schema


const photoSchema = new Schema({
  _id: mongoose.Types.ObjectId,
  url: String,
  reviewId: {type: mongoose.Types.ObjectId, ref: Review}
})

const Photo = mongoose.model('Photo', photoSchema, 'photos')

module.exports = Photo