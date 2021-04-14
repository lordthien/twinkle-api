const Manager = require('../models/Manager.model')

const jwt = require('jsonwebtoken')

module.exports = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const manager = await Manager.findOne({ username: decoded.data, 'tokens.token': token })
        .populate({path: 'role', populate: {
            path: 'features'
        }})
        if (!manager) {
            next()
        }
        req.token = token
        req.manager = manager
        next()
        
    } catch (e) {
        res.status(401).json({message: 'Error Authenticate.', status: "Failed"})
    }
}