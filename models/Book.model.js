const mongoose= require('mongoose');
const Customer = require('./Customer.model');
const Discount = require('./Discount.model');
const Service = require('./Service.model');
const Staff = require('./Staff.model');
const Store = require('./Store.model');
const { Schema } = mongoose;

const bookSchema = Schema({
    schedule: Date,
    totalPrice: Number,
    totalDuration: Number,
    cost: Number,
    note: String, 
    discount: {type: mongoose.Types.ObjectId, ref: Discount},
    staff: {type: mongoose.Types.ObjectId, ref: Staff},
    store: {type: mongoose.Types.ObjectId, ref: Store},
    customer: {type: mongoose.Types.ObjectId, ref: Customer},
    services: [{type: mongoose.Types.ObjectId, ref: Service}],
    status: String,
    createdAt: {type: Date, default: Date.now}
});

const Book = mongoose.model('Book', bookSchema,  'books')

module.exports = Book