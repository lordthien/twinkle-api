const mongoose = require('mongoose')
const Schema = mongoose.Schema


const featureSchema = new Schema({
  _id: mongoose.Types.ObjectId,
  title: String,
  description: String,
  createdDate: {type: Date, default: Date.now()},
})

const Feature = mongoose.model('Feature', featureSchema, 'features')

module.exports = Feature