const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Service = require('./Service.model')

const staffSchema = new Schema({
  _id: mongoose.Types.ObjectId,
  name: { type: String, default: '' },
  username: { type: String, unique: true },
  email: { type: String },
  password: { type: String, trim: true },
  avatar: { type: String, default: '/owner/default.png' },
  address: { type: String, default: '' },
  storeId: String,
  salary: Number,
  startWorkingDate: {type: Date, default: Date.now()},
  services: [{type: mongoose.Types.ObjectId, ref: Service}],
  books: [],
  notifications: []
})

staffSchema.methods.generateAuthToken = async function () {
  try {
    let staff = this
    let token = jwt.sign({ data: staff.username },process.env.JWT_SECRET, { expiresIn: '30 days'})
    staff.tokens = staff.tokens.concat({ token })
    await staff.save()
    return token
  } catch (e) {
    console.log(e)
  }
}

const Staff = mongoose.model('Staff', staffSchema, 'staffs')

module.exports = Staff