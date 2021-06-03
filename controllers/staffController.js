const Store = require('../models/Store.model')
const mongoose = require('mongoose')
const Service = require('../models/Service.model')
const Staff = require('../models/Staff.model')
const Book = require('../models/Book.model')

//cattocathien username => findOne({username: req.body.username})
//res.status(202).json({message: "Không đúng tên cửa hàng", status: "Failed"})
module.exports.login = async (req, res) => {
    try {
        req.body.store = req.body.store.toLowerCase()
        req.body.username = req.body.username.toLowerCase()
        let store = await Store.findOne({ username: req.body.store })
        if (!store) {
            res.status(202).json({ message: 'Store does not exist.', status: "Failed" })
            return
        }
        let staff = await Staff.findOne({username: req.body.username, storeId: store._id})
        if (req.body.password == staff.password) {
            const token = await staff.generateAuthToken()
            res.status(200).json({ staff, token, status: "Success" })
        }
        else {
            res.status(400).json({ message: 'Wrong password.', status: "Failed" })
        }
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
}
module.exports.logout = async (req, res) => {
    try {
        req.staff.tokens = req.staff.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.staff.save()
        res.status(200).json({ message: 'Successfully logout', status: "Success" })
    } catch (e) {
        res.status(400).json({ error: err })
    }
}
module.exports.logoutAll = async (req, res) => {
    try {
        req.staff.tokens = []
        await req.staff.save()
        res.status(200).json({ message: 'Successfully logout from all devices', status: "Success" })
    } catch (err) {
        res.status(400).json({ error: err })
    }
}

module.exports.getMyInformation = async (req, res) => {
    try {
        let store = await Store.findOne({ _id: req.staff.storeId })
        res.status(200).json({ staff: req.staff, store: store, status: "Success" })
    } catch (err) {
        res.status(400).json({ error: err })
    }
}

module.exports.getUnpaidBooks = async (req, res) => {
    try {
        let books = await Book.find({status: "BOOKED", staff: req.staff._id}).populate("services").populate("customer")
        books=books.filter((book) => book.schedule.getTime()>=(new Date()).getTime())
        res.status(200).json({books: books, status: "Success"})
    } catch (err) {
        res.status(400).json({error:err})
    }
}

module.exports.getBookById = async (req, res) => {
    try {
        let book = await Book.findOne({_id: req.query.id, staff: req.staff._id}).populate("services").populate("customer")
        res.status(200).json({book: book, status: "Success"})
    } catch (err) {
        res.status(400).json({error:err})
    }
}

module.exports.cancelBookById = async (req, res) => {
    try {
        let book = await Book.findOne({_id: req.query.id, staff: req.staff._id})
        book.status="CANCEL"
        book.save()
        res.status(200).json({book: book, status: "Success"})
    } catch (err) {
        res.status(400).json({error:err})
    }
}

module.exports.setPaidBookById = async (req, res) => {
    try {
        let book = await Book.findOne({_id: req.query.id, staff: req.staff._id})
        book.status="PAID"
        book.save()
        res.status(200).json({book: book, status: "Success"})
    } catch (err) {
        res.status(400).json({error:err})
    }
}

module.exports.changeInformation = async (req, res) => {
    try {
        let staff = await Staff.findByIdAndUpdate({_id: req.staff._id}, req.body)
        staff.save()
        res.status(200).json({book: staff, status: "Success"})
    } catch (err) {
        res.status(400).json({error:err})
    }
}

module.exports.changePassword = async (req, res) => {
    try {
        req.staff.password=req.body.password
        req.staff.save()
        res.status(200).json({book: req.staff, status: "Success"})
    } catch (err) {
        res.status(400).json({error:err})
    }
}