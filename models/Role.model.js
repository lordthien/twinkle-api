const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Feature = require('./Discount.model')

const roleSchema = new Schema({
  _id: mongoose.Types.ObjectId,
  roleTitle: String,
  roleDescription: String,
  createdDate: {type: Date, default: Date.now()},
  features: [{type: mongoose.Types.ObjectId, ref: Feature}]
})

const Role = mongoose.model('Role', roleSchema, 'roles')

module.exports = Role