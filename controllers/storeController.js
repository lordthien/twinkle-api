const Store = require('../models/Store.model')
const mongoose = require('mongoose')


module.exports.login = async (req, res) => {
    try {
        let store = await Store.findOne({ username: req.body.username })
        if (!store) {
            res.status(400).json({ message: 'User does not exist.', status: "Failed"})
            return
        }
        //let hashedPassword = md5(req.body.password) + req.body.username
        // bcrypt.compare(hashedPassword, user.hash).then(async (result) => {
        //     if (!result) {
        //         res.status(500).send({
        //             errors: ['Wrong password!']
        //         })
        //         return
        //     }
        //     else {
                
        //     }
        // })
        if(req.body.password==store.password) {
            const token = await store.generateAuthToken()
            res.status(200).json({ store, token, status: "Success" })
        }
        else {
            res.status(400).json({ message: 'Wrong password.', status: "Failed"})
        }
    } catch (err) {
        res.status(400).json({error:err})
    }
}
module.exports.logout = async (req, res) => {
    try {
        req.store.tokens = req.store.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.store.save()
        res.status(200).json({message: 'Successfully logout', status: "Success"})
    } catch (e) {
        res.status(400).json({error:err})
    }
}
module.exports.logoutAll = async (req, res) => {
    try {
        req.store.tokens = []
        await req.store.save()
        res.status(200).json({message: 'Successfully logout from all devices', status: "Success"})
    } catch (err) {
        res.status(400).json({error:err})
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

module.exports.getAllStaffs = async (req, res) => {
    try {
        res.status(200).json({stores: stores,status: "Success"})
    } catch (err) {
        res.status(400).json({error:err})
    }
}

module.exports.getAllServices = async (req, res) => {
    try {
        res.status(200).json({stores: stores,status: "Success"})
    } catch (err) {
        res.status(400).json({error:err})
    }
}

module.exports.getAllBooks = async (req, res) => {
    try {
        res.status(200).json({stores: stores,status: "Success"})
    } catch (err) {
        res.status(400).json({error:err})
    }
}

module.exports.createService = async (req, res) => {
    try {
        res.status(200).json({stores: stores,status: "Success"})
    } catch (err) {
        res.status(400).json({error:err})
    }
}

module.exports.createStaff = async (req, res) => {
    try {
        res.status(200).json({stores: stores,status: "Success"})
    } catch (err) {
        res.status(400).json({error:err})
    }
}

module.exports.editStoreInformation = async (req, res) => {
    try {
        res.status(200).json({stores: stores,status: "Success"})
    } catch (err) {
        res.status(400).json({error:err})
    }
}

module.exports.editService = async (req, res) => {
    try {
        res.status(200).json({stores: stores,status: "Success"})
    } catch (err) {
        res.status(400).json({error:err})
    }
}

module.exports.editStaff = async (req, res) => {
    try {
        res.status(200).json({stores: stores,status: "Success"})
    } catch (err) {
        res.status(400).json({error:err})
    }
}