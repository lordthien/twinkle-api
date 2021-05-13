const Store = require('../models/Store.model')
const mongoose = require('mongoose')


module.exports.login = async (req, res) => {
    try {
        let store = await Store.findOne({ username: req.body.username })
        if (!store) {
            res.status(400).json({ message: 'User does not exist.', status: "Failed"})
            return
        }
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
        req.body._id = new mongoose.Types.ObjectId()
        req.body.password = shortid.generate()
        if(req.file) {
            // while(req.file.path.indexOf("\\")>=0) req.file.path.replace("\\","/")
            req.body.avatar = `/${req.file.path}`
        } 
        let newStaff = new Store(req.body)
        newStaff.save().then(() => {
            const msg = {
                to: newStaff.email,
                from: 'noreply@twinkleapp.tk',
                subject: 'Successful Creating Store on Twinkle',
                html: `<strong>${newStaff.password}</strong>`
            }
            sgMail.send(msg).then(() => {
                res.status(200).json({store: newStaff,status: "Success"})
            }, error => {
                console.error(error);
                if (error.response) {
                console.error(error.response.body)
                }
            });
        })
    } catch (err) {
        res.status(400).json({error:err})
    }
}

module.exports.editStoreInformation = async (req, res) => {
    try {
        if(req.file) {
            //while(req.file.path.indexOf("\\")>=0) req.file.path.replace("\\","/")
            req.body.avatar = `/${req.file.path}`
        } 
        let result = await Store.findOneAndUpdate({_id: req.query.id},req.body)
        .then((result) => {  
            res.status(200).json({result: result,status: "Success"})
        }).catch(err =>  res.status(202).json({error:err, MESSAGE: "Fail to edit"}))
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