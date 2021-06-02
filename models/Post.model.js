const mongoose= require('mongoose');
const Photo = require('./Photo.model');
const Store = require('./Store.model');
const { Schema } = mongoose;

const postSchema = Schema({
    title: String, // String is shorthand for {type: String}
    author: String,
    description: String,
    content: String,
    thumbnail: {type: String, default: ""},
    store: {type: mongoose.Types.ObjectId, ref: Store},
    isPublic: {type: Boolean, default: false},
    modifiedAt: {type: Date, default: Date.now},
    publishedAt: {type: Date, default: Date.now}
});

const Post = mongoose.model('Post', postSchema,  'posts')

module.exports = Post