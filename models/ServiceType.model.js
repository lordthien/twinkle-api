const mongoose = require('mongoose')
const Service = require('./Service.model')
const Schema = mongoose.Schema

const serviceTypeSchema = new Schema({
  _id: mongoose.Types.ObjectId,
  name: { type: String, default: '' },
  thumbnail: { type: String, default: '/services/default.png' },
  services: [{type: mongoose.Types.ObjectId, ref: Service}],
  storeId: String
})

const ServiceType = mongoose.model('ServiceType', serviceTypeSchema, 'serviceTypes')

module.exports = ServiceType