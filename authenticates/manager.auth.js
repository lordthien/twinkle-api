const Manager = require('../models/Manager.model')

const jwt = require('jsonwebtoken')

module.exports = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const manager = await Manager.findOne({ _id: decoded._id, 'tokens.token': token }).populate('role')
        if (!manager) {
            next()
        }
        req.token = token
        req.manager = manager
        next()
        
    } catch (e) {
        res.status(401).send('Error Authenticate.')
    }
}