const mongoose = require('mongoose')
const Schema = mongoose.Schema
const jwt = require('jsonwebtoken')

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

customerSchema.methods.generateAuthToken = async function () {
  try {
    let user = this
    let token = jwt.sign({ data: user.email },process.env.JWT_SECRET, { expiresIn: '30 days'})
    user.tokens.push({ token })
    await user.save()
    return token
  } catch (e) {
    console.log(e)
  }
}

const Customer = mongoose.model('Customer', customerSchema, 'customers')

module.exports = Customer