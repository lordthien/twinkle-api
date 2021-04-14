const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const Schema = mongoose.Schema

const Role = require('./Role.model')

const managerSchema = new Schema({
  _id: mongoose.Types.ObjectId,
  username: { type: String, unique: true, lowercase: true },
  name: { type: String },
  password: { type: String },
  role: { type: mongoose.Types.ObjectId, ref: Role },
  tokens: [{token: String}]
})

managerSchema.methods.generateAuthToken = async function () {
  try {
    let manager = this
    let token = jwt.sign({ data: manager.username },process.env.JWT_SECRET, { expiresIn: '1h'})
    manager.tokens = manager.tokens.concat({ token })
    await manager.save()
    return token
  } catch (e) {
    console.log(e)
  }
}

const Manager = mongoose.model('Manager', managerSchema, 'managers')

module.exports = Manager