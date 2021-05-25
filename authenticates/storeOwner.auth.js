const Store = require('../models/Store.model')

const jwt = require('jsonwebtoken')

module.exports = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const store = await Store.findOne({ username: decoded.data, 'tokens.token': token })
        // .populate({path: 'role', populate: {
        //     path: 'features'
        // }})
        if (!store) {
            next()
        }
        req.token = token
        req.store = store
        next()
        
    } catch (e) {
        res.status(401).json({message: 'Error Authenticate.', status: "Failed"})
    }
}