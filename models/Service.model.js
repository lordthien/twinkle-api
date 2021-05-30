const mongoose = require('mongoose')
const Schema = mongoose.Schema

const serviceSchema = new Schema({
  _id: mongoose.Types.ObjectId,
  name: { type: String, default: '' },
  thumbnail: { type: String, default: '/services/default.png' },
  createdDate: {type: Date, default: Date.now()},
  description: { type: String, default: '' },
  duration: Number,
  storeId: String,
  serviceTypeId: String,
  price: Number
})

const Service = mongoose.model('Service', serviceSchema, 'services')

module.exports = Service