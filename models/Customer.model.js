const mongoose = require('mongoose')
const Schema = mongoose.Schema


const customerSchema = new Schema({
  _id: mongoose.Types.ObjectId,
  username: String,
  name: String,
  password: String,
  email: String,
  phoneNumber: { type: String, default: ''},
  avatar: { type: String, default: 'public/app/avatar.png' },
  createdDate: {type: Date, default: Date.now()},
  tokens: [{type: String}],
  socialMediaToken: [{socialMedia: String, token: String}],
  books: [],
  notifications: []
})

const Customer = mongoose.model('Customer', customerSchema, 'customers')

module.exports = Customer