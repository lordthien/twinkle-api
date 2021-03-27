const express = require('express')
const multer = require('multer')

const router = express.Router()

const controller = require('../controllers/ownerController')

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

router.post('/', controller.createNewStore)

// router.get('/search', controller.search)

// router.patch('/:id', upload.array('photos', 8), controller.patchByID)

// router.get('/:id', controller.getByID)

// router.post('/:id', authLogin, upload.array('photos', 4), controller.postByID)

// router.get('/:id/product', controller.getProductByID)

// router.post('/:id/product', authLogin, upload.array('photos', 4), controller.postProductByID)

module.exports = router