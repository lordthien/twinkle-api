const Customer = require('../models/Customer.model')

const jwt = require('jsonwebtoken')

module.exports = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const customer = await Customer.findOne({ email: decoded.data, 'tokens.token': token })
        if (!manager) {
            next()
        }
        req.token = token
        req.customer = customer
        next()
        
    } catch (e) {
        res.status(401).json({message: 'Error Authenticate.', status: "Failed"})
    }
}