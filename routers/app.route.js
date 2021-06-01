const express = require('express')
const multer = require('multer')

const router = express.Router()

const customerAuth = require('../authenticates/customer.auth')

const customerController = require('../controllers/customerController')
const appController = require('../controllers/appController')

//Login, Logout
router.post('/signup', customerController.signUp)
router.post('/login', customerController.login)
router.post('/logout', customerAuth, 
customerController.logout)
router.post('/logoutAll', customerAuth, 
customerController.logoutAll)
router.get('/me', customerAuth, 
customerController.getMyInformation)
router.post('/editMe', customerAuth, 
customerController.editMyInformation)

router.get('/allStores',
appController.getAllStores)
router.get('/storeById',
appController.getStoreById)
router.get('/staffById',
appController.staffById)
router.get('/staffsByStoreId',
appController.getAllStaffsByStoreId)
router.get('/servicesByStoreId',
appController.getServicesByStoreId)
router.get('/search',
appController.search)

router.get('/allBooks', customerAuth, 
appController.getAllBooks)
router.get('/paidBooks', customerAuth, 
appController.getPaidBooks)
router.get('/unpaidBooks', customerAuth, 
appController.getUnpaidBooks)
router.post('/booking', customerAuth,
appController.bookASchedule )
router.post('/payment', appController.payment)

module.exports = router