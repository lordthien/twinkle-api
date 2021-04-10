const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Role = require('./Role.model')

const managerSchema = new Schema({
  _id: mongoose.Types.ObjectId,
  username: { type: String, unique: true, lowercase: true },
  name: { type: String },
  password: { type: String },
  role: { type: mongoose.Types.ObjectId, ref: Role },
  tokens: [String]
})

const Manager = mongoose.model('Manager', managerSchema, 'managers')

module.exports = Manager