const mongoose = require('mongoose')
const Schema = mongoose.Schema

const storeTypeSchema = new Schema({
  _id: mongoose.Types.ObjectId,
  //Storing some basic information of user
  title: { type: String, default: '' },
  thumbnail: { type: String, default: '/stores/default.png' },
  description: { type: String, default: '' },
})

const StoreType = mongoose.model('StoreTypes', storeTypeSchema, 'storeTypes')

module.exports = StoreType