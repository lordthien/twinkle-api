const Customer = require('../models/Customer.model')
const mongoose = require('mongoose')
const sgMail = require('@sendgrid/mail')

require('dotenv').config()
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports.signUp = async (req, res) =>{
    try {
        req.body._id = new mongoose.Types.ObjectId()
        let newCustomer = new Customer(req.body)
        newCustomer.save().then(() => {
            const msg = {
                to: newCustomer.email,
                from: 'noreply@twinkleapp.tk',
                subject: 'Welcome to Twinkle',
                html: `<strong>${newCustomer.name}</strong>`
            }
            sgMail.send(msg).then(() => {
                res.status(200).json({customer: newCustomer,status: "Success"})
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

module.exports.login = async (req, res) => {
    try {
        let customer = await Customer.findOne({ email: req.body.email })
        if (!customer) {
            res.status(400).json({ message: 'User does not exist.', status: "Failed"})
            return
        }
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
        let customer = await Customer.findOne({ _id: req.customer._id })
        res.status(200).json({ customer, token, status: "Success" })
    } catch (err) {
        res.status(400).json({error:err})
    }
}