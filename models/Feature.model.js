const mongoose = require('mongoose')
const Store = require('./Store.model')
const Schema = mongoose.Schema

const discountSchema = new Schema({
  _id: mongoose.Types.ObjectId,
  name: String,
  code: String,
  description: String,
  expiration: Date,
  appliedStore: [{type: mongoose.Types.ObjectId, ref: Store}]
})

const Discount = mongoose.model('Discount', discountSchema, 'discounts')

module.exports = Discount