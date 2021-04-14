const express = require('express')
const multer = require('multer')

const router = express.Router()

const managerAuth = require('../authenticates/manager.auth')

const controller = require('../controllers/managerController')

//Login, Logout
router.post('/login', controller.login)
router.post('/logout', //managerAuth, 
controller.logout)
router.post('/logoutAll', //managerAuth, 
controller.logoutAll)

router.get('/me', //managerAuth, 
controller.getMyInformation)
router.get('/allFeatures', //managerAuth, 
controller.getAllFeatures)
router.get('/allRoles', //managerAuth, 
controller.getAllRoles)
router.get('/allManagers', //managerAuth, 
controller.getAllManager)

//Create features, roles, manager for manager
router.post('/createFeature', //managerAuth, 
controller.createFeature)
router.post('/createRole', //managerAuth, 
controller.createRole)
router.post('/createManager', //managerAuth, 
controller.createManager)
router.post('/createCoupon', //managerAuth, 
controller.createCoupon)

router.put('/updateFeature', //managerAuth,
controller.changeFeature)
router.put('/updateRole', //managerAuth, 
controller.changeRole)
router.put('/updateManager', //managerAuth,
controller.changeManager)

router.patch('/addFeature', //managerAuth,
controller.addFeatureToRole)
router.patch('/addAllFeatures', //managerAuth,
controller.addAllFeaturesToRole)
router.patch('/removeFeature', //managerAuth,
controller.removeFeatureFromRole)

router.delete('/deleteFeature', //managerAuth
controller.deleteFeature)
router.delete('/deleteRole', //managerAuth
controller.deleteRole)
router.delete('/deleteManager', //managerAuth
controller.deleteManager)

module.exports = router