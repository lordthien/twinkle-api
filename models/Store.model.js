const mongoose = require('mongoose')
const Schema = mongoose.Schema
const url = require('url')
const jwt = require('jsonwebtoken')
const Review = require('./Review.model')
const Photo = require('./Photo.model')
const StoreType = require('./StoreType.model')
const Staff = require('./Staff.model')

const storeSchema = new Schema({
  _id: mongoose.Types.ObjectId,
  //Storing some basic information of user
  name: { type: String, default: '' },
  username: { type: String, unique: true, trim: true },
  email: { type: String },
  password: { type: String, trim: true },
  avatar: { type: String, default: '/stores/default.png' },
  address: { type: String, default: '' },
  location: { latitude: String, longitude: String },
  phoneNumber: { type: String, default: '' },
  openTime: { type: String, default: '' },
  description: { type: String, default: '' },
  createdDate: {type: Date, default: Date.now()},
  photos: [{ type: mongoose.Types.ObjectId, ref: Photo}],
  staffs: [{ type: mongoose.Types.ObjectId, ref: Staff}],
  //Type of Store
  storeType: { type: mongoose.Types.ObjectId, ref: StoreType },
  //Reviews
  reviews: [{type: mongoose.Types.ObjectId, ref: Review}],
  tokens: [{token: String}],
  //Store Owner is also a user but have a medal to improve that this user is a store owner
  // storeOwner: { type: mongoose.Types.ObjectId, default: null },
})

storeSchema.methods.toJSON = function () {
  const store = this
  const storeObject = store.toObject()
  // Replace cai \ thanh cai / ni
  storeObject.tokens=[]
  storeObject.avatar = storeObject.avatar.replace('\\', '/').replace('\\', '/')
  storeObject.description = storeObject.description.split("\n", 20)
  var sum = 0
  storeObject.reviews.forEach((review) => {
    sum = sum + review.point
  })
  if (sum) storeObject.averagePoint = (sum / storeObject.reviews.length)
  else storeObject.averagePoint = 0
  return storeObject
}

storeSchema.methods.generateAuthToken = async function () {
  try {
    let store = this
    let token = jwt.sign({ data: store.username },process.env.JWT_SECRET, { expiresIn: '30 days'})
    store.tokens = store.tokens.concat({ token })
    await store.save()
    return token
  } catch (e) {
    console.log(e)
  }
}

const Store = mongoose.model('Store', storeSchema, 'stores')

module.exports = Store