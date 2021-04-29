const express = require('express')
const router = express.Router()
const controller = require('../controllers/storeController')
const multer = require('multer')
const storeAuth = require('../authenticates/storeOwner.auth')


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/owner/')
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString() + file.originalname)
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

router.post('/login', controller.login )
router.post('/logout', storeAuth, controller.logout )
router.post('/logoutAll', storeAuth, controller.logoutAll )

router.get('/allStaffs', storeAuth, controller.getAllStaffs )
router.get('/allServices', storeAuth, controller.getAllServices )
router.get('/allBooks', storeAuth, controller.getAllBooks )


router.post('/createService', storeAuth, controller.createService )
router.post('/createStaff', storeAuth, controller.createStaff )

router.put('/editStoreInformation', storeAuth, controller.editStoreInformation)
router.put('/editService', storeAuth, controller.editService)
router.put('/editStaff', storeAuth, controller.editStaff)

module.exports = router