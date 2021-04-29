const Customer = require('../models/Customer.model')
const mongoose = require('mongoose')


module.exports.login = async (req, res) => {
    try {
        let customer = await Customer.findOne({ username: req.body.username })
        if (!customer) {
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
        if(req.body.password==customer.password) {
            const token = await customer.generateAuthToken()
            res.status(200).json({ customer, token, status: "Success" })
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
        req.customer.tokens = req.customer.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.customer.save()
        res.status(200).json({message: 'Successfully logout', status: "Success"})
    } catch (e) {
        res.status(400).json({error:err})
    }
}
module.exports.logoutAll = async (req, res) => {
    try {
        req.customer.tokens = []
        await req.customer.save()
        res.status(200).json({message: 'Successfully logout from all devices', status: "Success"})
    } catch (err) {
        res.status(400).json({error:err})
    }
}

module.exports.getMyInformation = async (req, res) => {
    try {
        let customer = await Customer.findOne({ username: req.customer.username })
        res.status(200).json({ customer, token, status: "Success" })
    } catch (err) {
        res.status(400).json({error:err})
    }
}