const Staff = require('../models/Staff.model')

const jwt = require('jsonwebtoken')

module.exports = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const staff = await Staff.findOne({ username: decoded.data , 'tokens.token': token} )
        if (!staff) {
            next()
        }
        req.token = token
        req.staff = staff
        next()
        
    } catch (e) {
        res.status(401).json({message: 'Error Authenticate.', status: "Failed"})
    }
}