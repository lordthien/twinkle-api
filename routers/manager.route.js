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
router.get('/storeById', //managerAuth, 
controller.getStoreById)
router.get('/allStoreTypes', //managerAuth, 
controller.getAllStoreTypes)
router.get('/allBlogs', //managerAuth, 
controller.getAllBlogs)
router.get('/blogById', //managerAuth, 
controller.getBlogById)
router.get('/allDiscounts',
controller.getAllDiscounts)
router.get('/discountById',
controller.getDiscountById)
router.get('/allCustomers',
controller.getAllCustomers)

//Create features, roles, manager for manager
router.post('/createFeature', //managerAuth, 
controller.createFeature)
router.post('/createRole', //managerAuth, 
controller.createRole)
router.post('/createManager', //managerAuth, 
controller.createManager)
router.post('/createStore', managerAuth, upload.single("avatar"),
controller.createStore)
router.post('/createStoreType', managerAuth, upload.single("thumbnail"),
controller.createStoreType)
router.post('/createBlog', managerAuth, upload.single("thumbnail"),
controller.createBlog)
router.post('/createDiscount', managerAuth, controller.createDiscount)

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
router.patch('/editStoreType', managerAuth, upload.single("thumbnail"),
controller.editStoreType)
router.patch('/editBlog', managerAuth, upload.single("thumbnail"),
controller.editBlog)
router.patch('/editDiscount', managerAuth,
controller.editDiscount)
router.patch('/addStoreToDiscount', managerAuth,
controller.addStoreToDiscount)

// router.delete('/deleteFeature', //managerAuth,
// controller.deleteFeature)
// router.delete('/deleteRole', //managerAuth,
// controller.deleteRole)
// router.delete('/deleteManager', //managerAuth,
// controller.deleteManager)
router.delete('/deleteCustomer', managerAuth,
controller.deleteCustomer)
router.delete('/deleteStore', managerAuth,
controller.deleteStore)
router.delete('/deleteStorePhotos', managerAuth,
controller.deleteStorePhotos)
router.delete('/deleteStoreType', managerAuth, 
controller.deleteStoreType)
router.delete('/deleteBlog', managerAuth, 
controller.deleteBlog)
router.delete('/deleteDiscount', managerAuth, 
controller.deleteDiscount)

module.exports = router
