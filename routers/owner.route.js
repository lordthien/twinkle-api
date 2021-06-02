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
const controller = require('../controllers/storeController')
const storeAuth = require('../authenticates/storeOwner.auth')


router.post('/login', controller.login )
router.post('/logout', storeAuth, controller.logout )
router.post('/logoutAll', storeAuth, controller.logoutAll )

router.get('/me', storeAuth, controller.storeInformation )
router.get('/allStaffs', storeAuth, controller.getAllStaffs )
router.get('/allServices', storeAuth, controller.getAllServices )
router.get('/allServicesType', storeAuth, controller.getAllServicesType )
router.get('/allBooks', storeAuth, controller.getAllBooks )
router.get('/allPosts', storeAuth, controller.getAllPosts )
router.get('/staffById', storeAuth, controller.getStaffById )
router.get('/serviceById', storeAuth, controller.getServiceById )
router.get('/serviceTypeById', storeAuth, controller.getServiceTypeById )
router.get('/bookById', storeAuth, controller.getBookById )
router.get('/postById', storeAuth, controller.getPostById )
router.get('/fixPath', controller.fixPath)
//BOOKS
router.get('/allBooks', storeAuth, 
controller.getAllBooks)
router.get('/paidBooks', storeAuth, 
controller.getPaidBooks)
router.get('/unpaidBooks', storeAuth, 
controller.getUnpaidBooks)
router.get('/cancelBooks', storeAuth, 
controller.getCancelBooks)
router.get('/bookById', storeAuth, 
controller.getBookById)

router.post('/createPost', storeAuth, upload.single("thumbnail"), controller.createPost )
router.post('/createService', storeAuth, upload.single("thumbnail"), controller.createService )
router.post('/createServiceType', storeAuth, upload.single("thumbnail"), controller.createServiceType )
router.post('/createStaff', storeAuth, upload.single("avatar"), controller.createStaff )

router.patch('/changeCover', storeAuth, upload.single("url"), controller.changeCover)
router.patch('/editStoreInformation', storeAuth, upload.single("avatar"), controller.editStoreInformation)
router.patch('/editService', storeAuth, upload.single("thumbnail"), controller.editService)
router.patch('/editServiceType', storeAuth, upload.single("thumbnail"), controller.editServiceType )
router.patch('/editStaff', storeAuth, upload.single("avatar"), controller.editStaff)
router.patch('/editPost', storeAuth, upload.single("thumbnail"), controller.editPost )
router.patch('/uploadPhotos', storeAuth, upload.array("photos", 5), controller.addPhotos)
router.patch('/addServiceToStaff', storeAuth, controller.addService)
router.patch('/removeServiceFromStaff', storeAuth, controller.removeService)

router.delete('/deletePost', storeAuth, controller.deletePost)
router.delete('/deleteService', storeAuth, controller.deleteService)
router.delete('/deleteServiceType', storeAuth, controller.deleteServiceType)
router.delete('/deleteStaff', storeAuth, controller.deleteStaff)

module.exports = router