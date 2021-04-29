const Store = require('../models/Store.model')
const mongoose = require('mongoose')


module.exports.getAllStores = async (req, res) => {
    try {
        const stores = await Store.find().populate('reviews').populate('photos')
        res.status(200).json({stores: stores,status: "Success"})
    } catch (err) {
        res.status(400).json({error:err})
    }
}

module.exports.bookASchedule = async (req, res) => {
    try {
        res.status(200).json({stores: stores,status: "Success"})
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