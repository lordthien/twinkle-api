const mongoose= require('mongoose');
const Photo = require('./Photo.model');
const Store = require('./Store.model');
const { Schema } = mongoose;

const postSchema = Schema({
    content: String,
    photos: [{type: mongoose.Types.ObjectId, ref: Photo}],
    store: {type: mongoose.Types.ObjectId, ref: Store},
    modifiedAt: {type: Date, default: Date.now},
    publishedAt: {type: Date, default: Date.now}
});

const Post = mongoose.model('Post', postSchema,  'posts')

module.exports = Post