const mongoose = require('mongoose')
const Schema = mongoose.Schema

const storeTypeSchema = new Schema({
  _id: mongoose.Types.ObjectId,
  //Storing some basic information of user
  title: { type: String, default: '' },
  thumbnail: { type: String, default: '/storeTypes/default.png' },
  createdDate: {type: Date, default: Date.now()},
  description: { type: String, default: '' },
})

const StoreType = mongoose.model('StoreTypes', storeTypeSchema, 'storeTypes')

module.exports = StoreType