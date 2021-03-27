const mongoose = require('mongoose')
const Schema = mongoose.Schema
const url = require('url')


const ownerSchema = new Schema({
  _id: mongoose.Types.ObjectId,
  //Storing some basic information of user
  name: { type: String, default: '' },
  avatar: { type: String, default: 'public/avatar/default.png' },
  address: { type: String, default: '' },
  phoneNumber: { type: String, default: '' },
  openTime: { type: String, default: '' },
  description: { type: String, default: '' },
  photos: [String],
  //Type of Store: Pet Care? Pet Cafe? Pet Shop?
  storeType: { type: String, default: '' },
  //Store Owner is also a user but have a medal to improve that this user is a store owner
  storeOwner: { type: mongoose.Types.ObjectId, default: null },
  //Reviews
  reviews: [{
    reviewer: mongoose.Types.ObjectId,
    author: String,
    avatar: String,
    point: { type: Number, default: 4 },
    body: String,
    photos: [String]
  }]
})

ownerSchema.methods.toJSON = function () {
  const owner = this
  const ownerObject = owner.toObject()
  // Replace cai \ thanh cai / ni
  ownerObject.avatar = ownerObject.avatar.replace('\\', '/').replace('\\', '/')
  for (let i = 0; i < ownerObject.photos.length; i++) {
    ownerObject.photos[i] = ownerObject.photos[i].replace('\\', '/').replace('\\', '/')
  }
  ownerObject.phoneNumber = ownerObject.phoneNumber.split("\n", 10)
  ownerObject.address = ownerObject.address.split("\n", 10) 
  ownerObject.description = ownerObject.description.split("\n", 20)
  var sum = 0
  ownerObject.reviews.forEach((review) => {
    sum = sum + review.point
  })
  if (sum) ownerObject.averagePoint = (sum / ownerObject.reviews.length)
  else ownerObject.averagePoint = 0
  return ownerObject
}


const Owner = mongoose.model('Owner', ownerSchema, 'owners')

module.exports = Owner