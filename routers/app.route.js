const express = require('express')
const multer = require('multer')

const router = express.Router()

const customerAuth = require('../authenticates/customer.auth')
const staffAuth = require('../authenticates/staff.auth')

const staffController = require('../controllers/staffController')
const customerController = require('../controllers/customerController')
const appController = require('../controllers/appController')

//FOR CUSTOMER
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
router.get('/cancelBooks', customerAuth, 
appController.getCancelBooks)
router.get('/bookById', customerAuth, 
appController.getBookById)
router.post('/booking', customerAuth,
appController.bookASchedule )
router.post('/cancel', customerAuth, 
appController.cancelBookById)
router.post('/payment', appController.payment)

//FOR STAFF
router.post('/staff/login', staffController.login)
router.post('/staff/logout', staffAuth, 
staffController.logout)
router.post('/staff/logoutAll', staffAuth, 
staffController.logoutAll)
//GET
router.get('/staff/me', staffAuth, 
staffController.getMyInformation)
router.get('/staff/unpaidBooks', staffAuth, 
staffController.getUnpaidBooks)
router.get('/staff/bookById', staffAuth, 
staffController.getBookById)
router.post('/staff/cancel', staffAuth, 
staffController.cancelBookById)
router.post('/staff/setPaid', staffAuth, 
staffController.setPaidBookById)
router.post('/staff/changePassword', staffAuth, 
staffController.changePassword)


module.exports = router