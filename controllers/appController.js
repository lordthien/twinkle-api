const Store = require('../models/Store.model')
const mongoose = require('mongoose')
const slug = require('vietnamese-slug')
const Staff = require('../models/Staff.model')
const ServiceType = require('../models/ServiceType.model')
const Book = require('../models/Book.model')

module.exports.getAllStores  = async (req, res) => {
    try {
        const stores = await Store.find().populate('storeType').populate('reviews').populate('photos').populate('staffs')
        res.status(200).json({stores: stores,status: "Success"})
    } catch (err) {
        res.status(400).json({error:err})
    }
}


module.exports.search  = async (req, res) => {
    try {
        let stores = await Store.find().populate('storeType').populate('reviews').populate('photos').populate('staffs')
        let queryArray = req.query.q.split(" ")
        queryArray.forEach(element => {
            stores = stores.filter((e) => slug(e.name).includes(element))
        });
        res.status(200).json({stores: stores,status: "Success"})
    } catch (err) {
        res.status(400).json({error:err})
    }
}

module.exports.getStoreById  = async (req, res) => {
    try {
        const store = await Store.findById(req.query.id).populate('storeType').populate('reviews').populate('photos').populate('staffs')
        res.status(200).json({store: store,status: "Success"})
    } catch (err) {
        res.status(400).json({error:err})
    }
}

module.exports.getAllStaffsByStoreId  = async (req, res) => {
    try {
        const staffs = await Staff.find({storeId: req.query.id})
        res.status(200).json({staffs: staffs,status: "Success"})
    } catch (err) {
        res.status(400).json({error:err})
    }
}

module.exports.staffById  = async (req, res) => {
    try {
        const staff = await Staff.findOne({_id: req.query.id})
        res.status(200).json({staff: staff,status: "Success"})
    } catch (err) {
        res.status(400).json({error:err})
    }
}

module.exports.getServicesByStoreId  = async (req, res) => {
    try {
        const types = await ServiceType.find({storeId: req.query.id}).populate('services')
        res.status(200).json({types: types,status: "Success"})
    } catch (err) {
        res.status(400).json({error:err})
    }
}

module.exports.bookASchedule = async (req, res) => {
    try {
        req.body._id = new mongoose.Types.ObjectId()
        let newBook = new Book(req.body)
        newBook.save()
        console.log(req.body)
        res.status(200).json({book: newBook, status: "Success"})
    } catch (err) {
        res.status(400).json({error:err})
    }
}

module.exports.getUnpaidBooks = async (req, res) => {
    try {
        let books = await Book.find({status: "BOOKED", customer: req.customer._id}).populate("services").populate("staff").populate("store")
        res.status(200).json({book: books, status: "Success"})
    } catch (err) {
        res.status(400).json({error:err})
    }
}

module.exports.getPaidBooks = async (req, res) => {
    try {
        let books = await Book.find({status: "PAID", customer: req.customer._id}).populate("services").populate("staff").populate("store")
        res.status(200).json({book: books, status: "Success"})
    } catch (err) {
        res.status(400).json({error:err})
    }
}

module.exports.getBookById = async (req, res) => {
    try {
        let book = await Book.findOne({_id: req.query.id, customer: req.customer._id}).populate("services").populate("staff").populate("store")
        res.status(200).json({book: book, status: "Success"})
    } catch (err) {
        res.status(400).json({error:err})
    }
}


module.exports.getCancelBooks = async (req, res) => {
    try {
        let books = await Book.find({status: "CANCEL", customer: req.customer._id}).populate("services").populate("staff").populate("store")
        res.status(200).json({book: books, status: "Success"})
    } catch (err) {
        res.status(400).json({error:err})
    }
}


module.exports.getAllBooks = async (req, res) => {
    try {
        let books = await Book.find({customer: req.customer._id}).populate("services").populate("staff").populate("store")
        res.status(200).json({book: books, status: "Success"})
    } catch (err) {
        res.status(400).json({error:err})
    }
}

module.exports.cancelBookById = async (req, res) => {
    try {
        let book = await Book.findOne({_id: req.query.id, customer: req.customer._id})
        book.status="CANCEL"
        book.save()
        res.status(200).json({book: book, status: "Success"})
    } catch (err) {
        res.status(400).json({error:err})
    }
}

module.exports.payment = async (req, res) => {
    try {
        res.status(200).json({stores: stores,status: "Success"})
    } catch (err) {
        res.status(400).json({error:err})
    }
}