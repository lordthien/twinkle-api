const express = require('express')
const multer = require('multer')

const router = express.Router()

const customerAuth = require('../authenticates/customer.auth')

const customerController = require('../controllers/customerController')
const appController = require('../controllers/appController')

//Login, Logout
router.post('/login', customerController.login)
router.post('/logout', customerAuth, 
customerController.logout)
router.post('/logoutAll', customerAuth, 
customerController.logoutAll)

router.get('/me', customerAuth, 
customerController.getMyInformation)

router.get('/allStores', //managerAuth, 
appController.getAllStores)

router.post('/booking', customerAuth,
appController.bookASchedule )
router.post('/payment', appController.payment)

module.exports = router