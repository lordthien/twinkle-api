const mongoose = require('mongoose')
const Schema = mongoose.Schema


const customerSchema = new Schema({
  _id: mongoose.Types.ObjectId,
  username: String,
  displayName: String,
  password: String,
  email: String,
  tokens: [{type: String}],
})

const Customer = mongoose.model('Customer', customerSchema, 'customers')

module.exports = Customer