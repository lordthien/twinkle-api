const mongoose= require('mongoose')
const { Schema } = mongoose;

const blogSchema = Schema({
    title: String, // String is shorthand for {type: String}
    author: String,
    description: String,
    thumbnail: String,
    content: String,
    slug: {type: String, unique: true},
    isPublic: Boolean,
    modifiedAt: {type: Date, default: Date.now},
    publishedAt: {type: Date, default: Date.now}
});

const Blog = mongoose.model('Blog', blogSchema,  'blogs')

module.exports = Blog