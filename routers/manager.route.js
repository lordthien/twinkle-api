const express = require('express')
const multer = require('multer')

const router = express.Router()

const managerAuth = require('../authenticates/manager.auth')

const controller = require('../controllers/managerController')

router.post('/login', controller.login )

router.post('/logout', //managerAuth, 
controller.logout )

router.get('/me', //managerAuth, 
controller.getMyInformation)

//Create features, roles, manager for manager
router.post('/createFeature'//managerAuth, 
controller.createFeature)
router.post('/createRole', //managerAuth, 
controller.createRole)
router.post('/createManager', //managerAuth, 
controller.createManager)
router.post('/createCoupon', //managerAuth, 
controller.createCoupon)

router.post('/deleteFeature', //managerAuth
controller.deleteFeature)
router.post('/deleteRole', //managerAuth
controller.deleteRole)
router.post('/deleteManager', //managerAuth
controller.deleteManager)

module.exports = router