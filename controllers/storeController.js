const Store = require('../models/Store.model')
const mongoose = require('mongoose')

module.exports.createNewStore = async (req, res) => {
    try {
        var newStore = new Store({
            _id: new mongoose.Types.ObjectId,
            name: req.body.name,
            address: req.body.address,
            phoneNumber: req.body.phoneNumber,
            openTime: req.body.openTime,
            description: req.body.description,
            storeType: req.body.storeType
        })
        if (req.files.length != 0) {
            for (let i = 0; i < req.files.length - 1; i++) {
                newStore.photos.push(req.files[i].path)
            }
            newStore.avatar = req.files[req.files.length - 1].path
        }
        newStore.save().then(() => {
            res.status(200).send(newStore)
        })
    } catch (err) {
        res.status(400).send(err)
    }
}

module.exports.patchByID = async (req, res) => {
    try {
        var id = req.params.id
        var result = await Store.findById(id)
        if (!result) {
            return res.status(404).send('404 Not found.')
        }
        if(req.body.address) result.address=req.body.address
        if(req.body.phoneNumber) result.phoneNumber=req.body.phoneNumber
        if(req.body.openTime) result.openTime=req.body.openTime
        if(req.body.description) result.description=req.body.description
        if (req.files) {
            for (var i = 0; i < req.files.length; i++) {
                result.photos.push(req.files[i].path)
            }
        }
        result.save()
        res.status(200).send(result)
    } catch (e) {
        res.status(500).send(e)
    }
}