const express = require('express')
const multer = require('multer')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/stores/')
    },
    filename: (req, file, cb) => {
        cb(null, new Date().getTime() + file.originalname)
    }
})
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 24000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload an image'))
        }

        cb(undefined, true)
    }
})

const router = express.Router()

const managerAuth = require('../authenticates/manager.auth')

const controller = require('../controllers/managerController')

//Login, Logout
router.post('/login', controller.login)
router.post('/logout', managerAuth, 
controller.logout)
router.post('/logoutAll', managerAuth, 
controller.logoutAll)

router.get('/me', managerAuth, 
controller.getMyInformation)
// router.get('/allFeatures', //managerAuth, 
// controller.getAllFeatures)
// router.get('/allRoles', //managerAuth, 
// controller.getAllRoles)
router.get('/allManagers', //managerAuth, 
controller.getAllManagers)
router.get('/allStores', //managerAuth, 
controller.getAllStores)
router.get('/allStoreTypes', //managerAuth, 
controller.getAllStoreTypes)

//Create features, roles, manager for manager
router.post('/createFeature', //managerAuth, 
controller.createFeature)
router.post('/createRole', //managerAuth, 
controller.createRole)
router.post('/createManager', //managerAuth, 
controller.createManager)
router.post('/createCoupon', //managerAuth, 
controller.createCoupon)
router.post('/createStore', managerAuth, upload.single("avatar"),
controller.createStore)
router.post('/createStoreType', managerAuth, upload.single("thumbnail"),
controller.createStoreType)

// router.put('/updateFeature', //managerAuth,
// controller.changeFeature)
// router.put('/updateRole', //managerAuth, 
// controller.changeRole)
// router.put('/updateManager', //managerAuth,
// controller.changeManager)

// router.patch('/addFeature', //managerAuth,
// controller.addFeatureToRole)
// router.patch('/addAllFeatures', //managerAuth,
// controller.addAllFeaturesToRole)
// router.patch('/removeFeature', //managerAuth,
// controller.removeFeatureFromRole)
router.patch('/editStore', managerAuth, upload.single("avatar"),
controller.editStore)
router.post('/editStoreType', managerAuth, upload.single("thumbnail"),
controller.editStoreType)

// router.delete('/deleteFeature', //managerAuth,
// controller.deleteFeature)
// router.delete('/deleteRole', //managerAuth,
// controller.deleteRole)
// router.delete('/deleteManager', //managerAuth,
// controller.deleteManager)
router.delete('/deleteStore', managerAuth,
controller.deleteStore)

module.exports = router