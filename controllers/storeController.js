const Store = require('../models/Store.model')
const mongoose = require('mongoose')
const Service = require('../models/Service.model')
const Staff = require('../models/Staff.model')
const Photo = require('../models/Photo.model')
const Post = require('../models/Post.model')
const Book = require('../models/Book.model')
const shortid = require('shortid')
const sgMail = require('@sendgrid/mail')
const ServiceType = require('../models/ServiceType.model')
const Review = require('../models/Review.model')

require('dotenv').config()
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports.login = async (req, res) => {
    try {
        let store = await Store.findOne({ username: req.body.username })
        if (!store) {
            res.status(400).json({ message: 'User does not exist.', status: "Failed" })
            return
        }
        if (req.body.password == store.password) {
            const token = await store.generateAuthToken()
            res.status(200).json({ store, token, status: "Success" })
        }
        else {
            res.status(400).json({ message: 'Wrong password.', status: "Failed" })
        }
    } catch (err) {
        res.status(400).json({ error: err })
    }
}
module.exports.logout = async (req, res) => {
    try {
        req.store.tokens = req.store.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.store.save()
        res.status(200).json({ message: 'Successfully logout', status: "Success" })
    } catch (e) {
        res.status(400).json({ error: err })
    }
}
module.exports.logoutAll = async (req, res) => {
    try {
        req.store.tokens = []
        await req.store.save()
        res.status(200).json({ message: 'Successfully logout from all devices', status: "Success" })
    } catch (err) {
        res.status(400).json({ error: err })
    }
}

module.exports.storeInformation = async (req, res) => {
    try {
        let store = await Store.findById(req.store._id).populate("services").populate("photos")
        res.status(200).json({ store: store, status: "Success" })
    } catch (err) {
        res.status(400).json({ error: err })
    }
}
module.exports.getAllPhotos = async (req, res) => {
    try {
        let store = await Photo.find({storeId: req.store._id})
        res.status(200).json({ store: store, status: "Success" })
    } catch (err) {
        res.status(400).json({ error: err })
    }
}

module.exports.getAllStaffs = async (req, res) => {
    try {
        let staffs = await Staff.find({storeId: req.store._id}).populate("services")
        res.status(200).json({ staffs: staffs, status: "Success" })
    } catch (err) {
        res.status(400).json({ error: err })
    }
}

module.exports.getAllServices = async (req, res) => {
    try {
        let services = await Service.find({storeId: req.store._id})
        res.status(200).json({ services: services, status: "Success" })
    } catch (err) {
        res.status(400).json({ error: err })
    }
}


module.exports.getAllServicesType = async (req, res) => {
    try {
        let services = await ServiceType.find({storeId: req.store._id}).populate("services")
        res.status(200).json({ services: services, status: "Success" })
    } catch (err) {
        res.status(400).json({ error: err })
    }
}

module.exports.getAllCustomers = async (req, res) => {
    try {
        let books = await Book.find({store: req.store._id}).populate("customer")
        let customers = books.map((book) => book.customer).filter( (value, index, self) => self.indexOf(value) === index)
        res.status(200).json({ customers: customers, status: "Success" })
    } catch (err) {
        res.status(400).json({ error: err })
    }
}

module.exports.getAllPosts = async (req, res) => {
    try {
        let posts = await Post.find({store: req.store._id})
        res.status(200).json({ posts: posts, status: "Success" })
    } catch (err) {
        res.status(400).json({ error: err })
    }
}

module.exports.getPostById = async (req, res) => {
    try {
        let post = await Post.findOne({ _id: req.query.id })
        res.status(200).json({ post: post, status: "Success" })
    } catch (err) {
        res.status(400).json({ error: err })
    }
}

module.exports.getStaffById = async (req, res) => {
    try {
        let staff = await Staff.findOne({ _id: req.query.id }).populate("services")
        res.status(200).json({ staff: staff, status: "Success" })
    } catch (err) {
        res.status(400).json({ error: err })
    }
}

module.exports.getServiceById = async (req, res) => {
    try {
        let service = await Service.findOne({ _id: req.query.id })
        res.status(200).json({ service: service, status: "Success" })
    } catch (err) {
        res.status(400).json({ error: err })
    }
}

module.exports.getServiceTypeById = async (req, res) => {
    try {
        let service = await ServiceType.findOne({ _id: req.query.id })
        res.status(200).json({ service: service, status: "Success" })
    } catch (err) {
        res.status(400).json({ error: err })
    }
}

module.exports.createPost = async (req, res) => {
    try {
        req.body._id = new mongoose.Types.ObjectId()
        if (req.file) {
            req.body.thumbnail = `/${req.file.path.replace(/\\/g, "/")}`
            let newPhoto = new Photo({_id: new mongoose.Types.ObjectId(), url: req.body.thumbnail,storeId: req.store._id})
            newPhoto.save()
        }
        req.body.store = req.store._id
        // if(req.body.startWorkingDate!=="")
        //     req.body.startWorkingDate = new Date(req.body.startWorkingDate)
        let newPost = new Post(req.body)
        newPost.save().then(() => {
            res.status(200).json({ post: newPost, status: "Success" })
        })
    } catch (err) {
        res.status(400).json({ error: err })
    }
}


module.exports.createService = async (req, res) => {
    try {
        req.body._id = new mongoose.Types.ObjectId()
        if (req.file) {
            // while(req.file.path.indexOf("\\")>=0) req.file.path.replace("\\","/")
            req.body.thumbnail = `/${req.file.path.replace(/\\/g, "/")}`
        }
        req.body.storeId = req.store._id
        // if(req.body.startWorkingDate!=="")
        //     req.body.startWorkingDate = new Date(req.body.startWorkingDate)
        let newService = new Service(req.body)
        if(newService.serviceTypeId) {
            let type = await ServiceType.findOne({_id: newService.serviceTypeId})
            type.services.push(newService._id)
            type.save()
        }
        newService.save().then(() => {
            res.status(200).json({ staff: newService, status: "Success" })
        })
    } catch (err) {
        res.status(400).json({ error: err })
    }
}

module.exports.createServiceType = async (req, res) => {
    try {
        req.body._id = new mongoose.Types.ObjectId()
        if (req.file) {
            // while(req.file.path.indexOf("\\")>=0) req.file.path.replace("\\","/")
            req.body.thumbnail = `/${req.file.path.replace(/\\/g, "/")}`
        }
        req.body.storeId = req.store._id
        let newService = new ServiceType(req.body)
        newService.save().then(() => {
            res.status(200).json({ staff: newService, status: "Success" })
        })
    } catch (err) {
        res.status(400).json({ error: err })
    }
}

module.exports.createStaff = async (req, res) => {
    try {
        req.body._id = new mongoose.Types.ObjectId()
        req.body.password = shortid.generate()
        if (req.file) {
            // while(req.file.path.indexOf("\\")>=0) req.file.path.replace("\\","/")
            req.body.avatar = `/${req.file.path.replace(/\\/g, "/")}`
        }
        req.body.storeId = req.store._id
        if (req.body.startWorkingDate !== "" && req.body.startWorkingDate !== undefined)
            req.body.startWorkingDate = new Date(req.body.startWorkingDate)
        else req.body.startWorkingDate = new Date()
        let newStaff = new Staff(req.body)
        let store = await Store.findOne({_id: req.store._id})
        store.staffs.push(newStaff._id)
        store.save()
        newStaff.save().then(() => {
            const msg = {
                to: newStaff.email,
                from: 'noreply@twinkleapp.tk',
                subject: 'Successful Creating Store on Twinkle',
                html: `<strong>${newStaff.password}</strong>`
            }
            sgMail.send(msg).then(() => {
                res.status(200).json({ staff: newStaff, status: "Success" })
            }, error => {
                console.error(error);
                if (error.response) {
                    console.error(error.response.body)
                }
            });
        })
    } catch (err) {
        console.log(err)
        res.status(400).json({ error: err })
    }
}

module.exports.changeCover = async (req, res) => {
    try {
        if (req.file) {
            //while(req.file.path.indexOf("\\")>=0) req.file.path.replace("\\","/")
            req.body.url = `/${req.file.path.replace(/\\/g, "/")}`
        }
        req.body._id = new mongoose.Types.ObjectId()
        req.body.storeId = req.store._id
        let newCover = new Photo(req.body)
        newCover.save()
        console.log(newCover)
        let store = await Store.findOne({ _id: req.store._id })
        store.photos.unshift(newCover._id) 
        store.populated("photos")
        store.save().then(() => {
                res.status(200).json({ result: store, status: "Success" })
        })
    } catch (error) {
        res.status(400).json({ error: error })
    }
}

module.exports.editStoreInformation = async (req, res) => {
    try {
        if (req.file) {
            //while(req.file.path.indexOf("\\")>=0) req.file.path.replace("\\","/")
            req.body.avatar = `/${req.file.path}`
        }
        let result = await Store.findOneAndUpdate({ _id: req.store._id }, req.body)
            .then((result) => {
                res.status(200).json({ result: result, status: "Success" })
            }).catch(err => res.status(202).json({ error: err, MESSAGE: "Fail to edit" }))
    } catch (err) {
        res.status(400).json({ error: err })
    }
}

module.exports.editPost = async (req, res) => {
    try {
        if (req.file) {
            req.body.thumbnail = `/${req.file.path.replace(/\\/g, "/")}`
            let newPhoto = new Photo({_id: new mongoose.Types.ObjectId(), url: req.body.thumbnail,storeId: req.store._id})
            newPhoto.save()
        }
        let result = await Post.findOneAndUpdate({_id: req.query.id },req.body)
        result.save().then(() => {
            res.status(200).json({ result: result, status: "Success" })
        }, error => {
            console.error(error);
            if (error.response) {
                console.error(error.response.body)
            }
        });
    } catch (err) {
        res.status(400).json({ error: err })
    }
}

module.exports.editService = async (req, res) => {
    try {
        if (req.file) {
            // while(req.file.path.indexOf("\\")>=0) req.file.path.replace("\\","/")
            req.body.thumbnail = `/${req.file.path.replace(/\\/g, "/")}`
        }
        let result = await Service.findOneAndUpdate({_id: req.query.id },req.body)
        let type = await ServiceType.findOne({_id: result.serviceTypeId})
        if(!type.services.includes(result._id)) {
            type.services.push(result._id)
            type.save()
        }
        result.save().then(() => {
            res.status(200).json({ result: type, status: "Success" })
        }, error => {
            console.error(error);
            if (error.response) {
                console.error(error.response.body)
            }
        });
    } catch (err) {
        res.status(400).json({ error: err })
    }
}

module.exports.editServiceType = async (req, res) => {
    try {
        if (req.file) {
            // while(req.file.path.indexOf("\\")>=0) req.file.path.replace("\\","/")
            req.body.thumbnail = `/${req.file.path.replace(/\\/g, "/")}`
        }
        let result = await ServiceType.findOneAndUpdate({_id: req.query.id },req.body)
        result.save().then(() => {
            res.status(200).json({ result: result, status: "Success" })
        }, error => {
            console.error(error);
            if (error.response) {
                console.error(error.response.body)
            }
        });
    } catch (err) {
        res.status(400).json({ error: err })
    }
}

module.exports.editStaff = async (req, res) => {
    try {
        if (req.file) {
            // while(req.file.path.indexOf("\\")>=0) req.file.path.replace("\\","/")
            req.body.avatar = `/${req.file.path.replace(/\\/g, "/")}`
        }
        if (req.body.startWorkingDate !== "" && req.body.startWorkingDate !== undefined)
            req.body.startWorkingDate = new Date(req.body.startWorkingDate)
        else req.body.startWorkingDate = new Date()
        let result = await Staff.findOneAndUpdate({_id: req.query.id },req.body)
        result.save().then(() => {
            res.status(200).json({ result: result, status: "Success" })
        }, error => {
            console.error(error);
            if (error.response) {
                console.error(error.response.body)
            }
        });
    } catch (err) {
        console.log(err)
        res.status(400).json({ error: err })
    }
}

module.exports.addService = async (req, res) => {
    try {
        let result = await Staff.findOne({_id: req.query.id })
        if(result.services.filter((e) => e==req.body.serviceId).length<1)
            result.services.push(req.body.serviceId)
        result.save().then(() => {
            res.status(200).json({ result: result, status: "Success" })
        }, error => {
            console.error(error);
            if (error.response) {
                console.error(error.response.body)
            }
        });
    } catch (err) {
        console.log(err)
        res.status(400).json({ error: err })
    }
}

module.exports.addPhotos = async (req, res) => {
    try {
        let result = await Store.findOne({_id: req.store._id })
        if (req.files) {
            let newPhoto
            for(let i=0; i<req.files.length; i++) {
                newPhoto = new Photo({_id: new mongoose.Types.ObjectId(),url: `/${req.files[i].path.replace(/\\/g, "/")}`, storeId: req.store._id})
                newPhoto.save()
                result.photos.push(newPhoto._id)
            }
        }
        console.log(result.photos)
        result.save().then(() => {
            res.status(200).json({ result: result, status: "Success" })
        }, error => {
            console.error(error);
            if (error.response) {
                console.error(error.response.body)
            }
        });
    } catch (err) {
        console.log(err)
        res.status(400).json({ error: err })
    }
}

module.exports.removeService = async (req, res) => {
    try {
        let result = await Staff.findOne({_id: req.query.id })
        result.services=result.services.filter((e) => {
            if(e._id.toString()!==req.body.serviceId) return e
        })
        result.save().then(() => {
            res.status(200).json({ result: result, status: "Success" })
        }, error => {
            console.error(error);
            if (error.response) {
                console.error(error.response.body)
            }
        });
    } catch (err) {
        console.log(err)
        res.status(400).json({ error: err })
    }
}

module.exports.deletePhoto = async (req, res) => {
    try {
        let photo = await Photo.findOne({ _id: req.body.id })
        console.log(photo)
        let store = await Store.findOne({_id: photo.storeId})
        store.photos=store.photos.filter((p) => p._id!==photo._id)
        store.save()
        Photo.findOneAndDelete({ _id: req.body.id }, (error, result) => {
            if (error) {
                res.status(400).json({ error: error })
            }
            else {
                res.status(200).json({ result: result, status: "Success" })
            }
        })
    } catch (err) {
        res.status(400).json({ error: err })
    }
}

module.exports.deletePost = async (req, res) => {
    try {
        Post.findOneAndDelete({ _id: req.body.id }, (error, result) => {
            if (error) {
                res.status(400).json({ error: error })
            }
            else {
                res.status(200).json({ result: result, status: "Success" })
            }
        })

    } catch (err) {
        res.status(400).json({ error: err })
    }
}

module.exports.deleteService = async (req, res) => {
    try {
        Service.findOneAndDelete({ _id: req.body.id }, (error, result) => {
            if (error) {
                res.status(400).json({ error: error })
            }
            else {
                res.status(200).json({ result: result, status: "Success" })
            }
        })

    } catch (err) {
        res.status(400).json({ error: err })
    }
}

module.exports.deleteServiceType = async (req, res) => {
    try {
        let serviceType = await ServiceType.findOne({ _id: req.body.id })
        serviceType.services.forEach((ser) => {
            Service.findByIdAndDelete(ser)
        })
        serviceType.delete()
        res.status(200).json({ result: result, status: "Success" })
    } catch (err) {
        res.status(400).json({ error: err })
    }
}

module.exports.deleteStaff = async (req, res) => {
    try {
        let store = await Store.findOne({_id: req.store._id})
        store.staffs=store.staffs.filter((e) => {
            if(e.toString()!==req.body.id) return e
        })
        store.save()
        Staff.findOneAndDelete({ _id: req.body.id }, (error, result) => {
            if (error) {
                res.status(400).json({ error: error })
            }
            else {
                res.status(200).json({ result: result, status: "Success" })
            }
        })

    } catch (err) {
        res.status(400).json({ error: err })
    }
}

module.exports.fixPath = async (req,res) => {
    try {
        let result = await Photo.find()
        result.forEach((e) => {
            e.url = e.url.replace(/\\/g, "/")
            e.save()
        })
        res.json({ result })
    } catch (err) {
        throw err
        res.status(400).json({ error: err })
    }
}

//BOOK

module.exports.getUnpaidBooks = async (req, res) => {
    try {
        let books = await Book.find({status: "BOOKED", store: req.store._id}).populate("services").populate("staff").populate("store").populate("customer")
        res.status(200).json({books: books, status: "Success"})
    } catch (err) {
        res.status(400).json({error:err})
    }
}

module.exports.getPaidBooks = async (req, res) => {
    try {
        let books = await Book.find({status: "PAID", store: req.store._id}).populate("services").populate("staff").populate("store").populate("customer")
        res.status(200).json({books: books, status: "Success"})
    } catch (err) {
        res.status(400).json({error:err})
    }
}

module.exports.getCancelBooks = async (req, res) => {
    try {
        let books = await Book.find({status: "CANCEL", store: req.store._id}).populate("services").populate("staff").populate("store").populate("customer")
        res.status(200).json({books: books, status: "Success"})
    } catch (err) {
        res.status(400).json({error:err})
    }
}

module.exports.getAllBooks = async (req, res) => {
    try {
        let books = await Book.find({store: req.store._id}).populate("services").populate("staff").populate("store").populate("customer")
        res.status(200).json({books: books, status: "Success"})
    } catch (err) {
        res.status(400).json({error:err})
    }
}

module.exports.getAllReviews = async (req, res) => {
    try {
        let reviews = await Review.find({storeId: req.store._id}).populate("book")
        res.status(200).json({reviews: reviews, status: "Success"})
    } catch (err) {
        res.status(400).json({error:err})
    }
}

module.exports.getBookById = async (req, res) => {
    try {
        let book = await Book.findOne({_id: req.query.id, store: req.store._id}).populate("services").populate("staff").populate("store").populate("customer")
        res.status(200).json({book: book, status: "Success"})
    } catch (err) {
        res.status(400).json({error:err})
    }
}
