const md5 = require('md5')
const bcrypt = require('bcrypt')
const slug = require('vietnamese-slug')
const Manager = require('../models/Manager.model')
const Feature = require('../models/Discount.model')
const Role = require('../models/Role.model')
const Store = require('../models/Store.model')
const mongoose = require('mongoose')
const shortid = require('shortid')
const StoreType = require('../models/StoreType.model')
const Blog = require('../models/Blog.model')
const Discount = require('../models/Discount.model')
const sgMail = require('@sendgrid/mail')
const Staff = require('../models/Staff.model')
const Customer = require('../models/Customer.model')
const Photo = require('../models/Photo.model')
const Post = require('../models/Post.model')

require('dotenv').config()
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports.login = async (req, res) => {
    try {
        var manager = await Manager.findOne({ username: req.body.username })
        if (!manager) {
            res.status(204).json({ message: 'User does not exist.', status: "Failed"})
            return
        }
        //let hashedPassword = md5(req.body.password) + req.body.username
        // bcrypt.compare(hashedPassword, user.hash).then(async (result) => {
        //     if (!result) {
        //         res.status(500).send({
        //             errors: ['Wrong password!']
        //         })
        //         return
        //     }
        //     else {
                
        //     }
        // })
        if(req.body.password==manager.password) {
            const token = await manager.generateAuthToken()
            res.status(200).json({ manager, token, status: "Success" })
        }
        else {
            res.status(204).json({ message: 'Wrong password.', status: "Failed"})
        }
    } catch (err) {
        res.status(400).json({error:err})
    }
}
module.exports.logout = async (req, res) => {
    try {
        req.manager.tokens = req.manager.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.manager.save()
        res.status(200).json({message: 'Successfully logout', status: "Success"})
    } catch (e) {
        res.status(400).json({error:err})
    }
}
module.exports.logoutAll = async (req, res) => {
    try {
        req.manager.tokens = []
        await req.manager.save()
        res.status(200).json({message: 'Successfully logout from all devices', status: "Success"})
    } catch (err) {
        res.status(400).json({error:err})
    }
}

module.exports.getMyInformation = async (req, res) => {
    try {
        res.status(200).json({manager: req.manager, status: "Success"})
    } catch (err) {
        res.status(400).json({error:err})
    }
}
module.exports.getAllFeatures  = async (req, res) => {
    try {
        const features = await Feature.find()
        res.status(200).json({features: features,status: "Success"})
    } catch (err) {
        res.status(400).json({error:err})
    }
}
module.exports.getAllRoles  = async (req, res) => {
    try {
        const roles = await Role.find().populate('features')
        res.status(200).json({roles: roles,status: "Success"})
    } catch (err) {
        res.status(400).json({error:err})
    }
}
module.exports.getAllManagers  = async (req, res) => {
    try {
        const managers = await Manager.find().populate({path: 'role', populate: {
            path: 'features'
        }})
        res.status(200).json({managers: managers,status: "Success"})
    } catch (err) {
        res.status(400).json({error:err})
    }
}
module.exports.getAllStores  = async (req, res) => {
    try {
        const stores = await Store.find().populate('storeType').populate('reviews').populate('photos')
        res.status(200).json({stores: stores,status: "Success"})
    } catch (err) {
        res.status(400).json({error:err})
    }
}
module.exports.getStoreById  = async (req, res) => {
    try {
        const store = await Store.findById(req.query.id).populate('storeType').populate('reviews').populate('photos')
        res.status(200).json({store: store,status: "Success"})
    } catch (err) {
        res.status(400).json({error:err})
    }
}
module.exports.getAllStoreTypes  = async (req, res) => {
    try {
        const storeTypes = await StoreType.find()
        res.status(200).json({storeTypes: storeTypes,status: "Success"})
    } catch (err) {
        res.status(400).json({error:err})
    }
}
module.exports.getAllCustomers  = async (req, res) => {
    try {
        const customers = await Customer.find()
        res.status(200).json({customers: customers,status: "Success"})
    } catch (err) {
        res.status(400).json({error:err})
    }
}
module.exports.getAllPosts  = async (req, res) => {
    try {
        const posts = await Post.find()
        res.status(200).json({posts: posts,status: "Success"})
    } catch (err) {
        res.status(400).json({error:err})
    }
}
module.exports.getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.query.id)
        res.status(200).json({post: post,status: "Success"})
    } catch (err) {
        res.status(400).json({error:err})
    }
}
module.exports.getAllBlogs  = async (req, res) => {
    try {
        const blogs = await Blog.find()
        res.status(200).json({blogs: blogs,status: "Success"})
    } catch (err) {
        res.status(400).json({error:err})
    }
}
module.exports.getBlogById = async (req, res) => {
    try {
        const blog = await Blog.findById(req.query.id)
        res.status(200).json({blog: blog,status: "Success"})
    } catch (err) {
        res.status(400).json({error:err})
    }
}
module.exports.getAllDiscounts  = async (req, res) => {
    try {
        const discounts = await Discount.find().populate("appliedStore")
        res.status(200).json({discounts: discounts,status: "Success"})
    } catch (err) {
        res.status(400).json({error:err})
    }
}
module.exports.getDiscountById = async (req, res) => {
    try {
        const discount = await Discount.findOne({_id: req.query.id}).populate("appliedStore")
        res.status(200).json({discount: discount,status: "Success"})
    } catch (err) {
        res.status(400).json({error:err})
    }
}
//Create features, roles, manager for manager
module.exports.createFeature  = async (req, res) => {
    try {
        req.body._id= new mongoose.Types.ObjectId()
        const newFeature = new Feature(req.body)
        newFeature.save().then(() => {
            grantRoleAllFeature("6077164db025d53f76607376")
            res.status(200).json({feature: newFeature,status: "Success"})
        })
    } catch (err) {
        res.status(400).json({error:err})
    }
}

module.exports.createRole  = async (req, res) => {
    try {
        req.body._id = new mongoose.Types.ObjectId()
        const newRole = new Role(req.body)
        newRole.save().then(() => {
            res.status(200).json({role: newRole,status: "Success"})
        })
    } catch (err) {
        res.status(400).json({error:err})
    }
}
module.exports.createManager  = async (req, res) => {
    try {
        req.body._id= new mongoose.Types.ObjectId()
        const newManager = new Manager(req.body)
        newManager.save().then(() => {
            res.status(200).json({manager: newManager,status: "Success"})
        })
        res.status(200).json({status: "Success"})
    } catch (err) {
        res.status(400).json({error:err})
    }
}
module.exports.createDiscount = async (req, res) => {
    if(req.manager.role.roleTitle=="System Owner")
    try {
        req.body._id = new mongoose.Types.ObjectId()
        let newDiscount = new Discount(req.body)
        newDiscount.save().then(() => {
            res.status(200).json({store: newDiscount,status: "Success"})
        })
    } catch (err) {
        res.status(400).json({error:err})
    }
}

module.exports.createStore = async (req, res) => {
    if(req.manager.role.roleTitle=="System Owner")
    try {
        req.body._id = new mongoose.Types.ObjectId()
        req.body.password = shortid.generate()
        if(req.file) {
            // while(req.file.path.indexOf("\\")>=0) req.file.path.replace("\\","/")
            req.body.avatar = `/${req.file.path}`
        } 
        let newStore = new Store(req.body)
        newStore.save().then(() => {
            const msg = {
                to: newStore.email,
                from: 'noreply@twinkleapp.tk',
                subject: 'Successful Creating Store on Twinkle',
                html: `<strong>${newStore.password}</strong>`
            }
            sgMail.send(msg).then(() => {
                res.status(200).json({store: newStore,status: "Success"})
            }, error => {
                console.error(error);
                if (error.response) {
                console.error(error.response.body)
                }
            });
        })
    } catch (err) {
        res.status(400).json({error:err})
    }
}

module.exports.createStoreType = async (req, res) => {
    if(req.manager.role.roleTitle=="System Owner")
    try {
        req.body._id = new mongoose.Types.ObjectId()
        if(req.file) {
            // while(req.file.path.indexOf("\\")>=0) req.file.path.replace("\\","/")
            req.body.thumbnail = `/${req.file.path}`
        } 
        let newType = new StoreType(req.body)
        newType.save().then(() => {
            res.status(200).json({data: newType, status: "Success"})
        })
    } catch (err) {
        res.status(400).json({error:err})
    }
}

module.exports.createBlog = async (req, res) => {
    if(req.manager.role.roleTitle=="System Owner")
    try {
        req.body._id = new mongoose.Types.ObjectId()
        req.body.slug = slug(req.body.title)
        if(req.file) {
            // while(req.file.path.indexOf("\\")>=0) req.file.path.replace("\\","/")
            req.body.thumbnail = `/${req.file.path}`
        } 
        let newType = new Blog(req.body)
        newType.save().then(() => {
            res.status(200).json({data: newType, status: "Success"})
        })
    } catch (err) {
        res.status(400).json({error:err})
    }
}



// module.exports.changeRole  = async (req, res) => {
//     try {
//         res.status(200).json({status: "Success"})
//     } catch (err) {
//         res.status(400).json({error:err})
//     }
// }
// module.exports.changeFeature  = async (req, res) => {
//     try {
//         res.status(200).json({status: "Success"})
//     } catch (err) {
//         res.status(400).json({error:err})
//     }
// }
// module.exports.changeManager = async (req, res) => {
//     try {
//         res.status(200).json({status: "Success"})
//     } catch (err) {
//         res.status(400).json({error:err})
//     }
// }

// module.exports.addFeatureToRole = async (req, res) => {
//     try {
//         const role = await Role.findOne({_id: req.query.roleId})
//         if(!role.features.includes(req.body.featureId)) {
//             Role.findOneAndUpdate({_id: req.query.roleId}, { $push: {"features":new mongoose.Types.ObjectId(req.body.featureId)}})
//             .then( (result)  => { 
//                 res.status(200).json({feature: result, status: "Success"}) 
//             }).catch((error) => {
//                 res.status(400).json({error:err})
//             })
//         }
//         else {
//             res.status(400).json({message: "The role already has the feature", status: "Failed"}) 
//         }
//     } catch (err) {
//         res.status(400).json({error:err})
//     }
// }

// module.exports.addAllFeaturesToRole = async (req, res) => {
//     try {
//         grantRoleAllFeature(req.query.roleId)
//         res.status(200).json({message: "Grant all features.", status: "Success"}) 
//     } catch (err) {
//         res.status(400).json({error:err})
//     }
// }

// module.exports.removeFeatureFromRole = async (req, res) => {
//     try {
//         let role = await Role.findOne({_id: req.query.roleId})
//         role.features=role.features.filter(e => e.toString()!==req.body.featureId)
//         console.log(role)
//         Role.findOneAndUpdate({_id: req.query.roleId}, {features: role.features} ).then( (result)  => { 
//             res.status(200).json({feature: result, status: "Success"}) 
//         }).catch((error) => {
//             res.status(400).json({error:err})
//         })
//     } catch (err) {
//         res.status(400).json({error:err})
//     }
// }

// module.exports.deleteFeature = async (req, res) => {
//     try {
//         Feature.findOneAndDelete({_id: req.body.id}, (error,result) => {
//             if(error) {
//                 res.status(400).json({error:err})
//             }
//             else {
//                 res.status(200).json({result: result, status: "Success"})
//             }  
//         })
//     } catch (err) {
//         res.status(400).json({error:err})
//     }
// }
// module.exports.deleteRole = async (req, res) => {
//     try {
//         let role = await Role.findOne({_id: req.body.id})
//         if(role.roleTitle=="System Owner") {
//             res.status(400).json({message: "System Owner role cannot be deleted.", status: "Success"})
//         }
//         else {
//             Role.findOneAndDelete({_id: req.body.id}, (error,result) => {
//                 if(error) {
//                     res.status(400).json({error:err})
//                 }
//                 else {
//                     res.status(200).json({result: result, status: "Success"})
//                 }  
//             })
//         }
//     } catch (err) {
//         res.status(400).json({error:err})
//     }
// }
module.exports.deleteCustomer = async (req, res) => {
    try {
        if(req.manager.roleTitle=="System Owner") {
            res.status(400).json({message: "System Owner role cannot be deleted.", status: "Success"})
        }
        else {
            Customer.findOneAndDelete({_id: req.body.id}, (error,result) => {
                if(error) {
                    res.status(400).json({error: error})
                }
                else {
                    res.status(200).json({result: result, status: "Success"})
                }  
            })
        }
    } catch (err) {
        res.status(400).json({error:err})
    }
}
module.exports.deleteStore = async (req, res) => {
    try {
        if(req.manager.roleTitle=="System Owner") {
            res.status(400).json({message: "System Owner role cannot be deleted.", status: "Success"})
        }
        else {
            Store.findOneAndDelete({_id: req.body.id}, (error,result) => {
                if(error) {
                    res.status(400).json({error: error})
                }
                else {
                    res.status(200).json({result: result, status: "Success"})
                }  
            })
        }
    } catch (err) {
        res.status(400).json({error:err})
    }
}
module.exports.deleteStoreType = async (req, res) => {
    try {
        if(req.manager.roleTitle=="System Owner") {
            res.status(400).json({message: "System Owner role cannot be deleted.", status: "Success"})
        }
        else {
            StoreType.findOneAndDelete({_id: req.body.id}, (error,result) => {
                if(error) {
                    res.status(400).json({error: error})
                }
                else {
                    res.status(200).json({result: result, status: "Success"})
                }  
            })
        }
    } catch (err) {
        res.status(400).json({error:err})
    }
}
module.exports.deleteStorePhotos = async (req, res) => {
    try {
        if(req.manager.roleTitle=="System Owner") {
            res.status(400).json({message: "System Owner role cannot be deleted.", status: "Success"})
        }
        else {
            let store = await Store.findOne({_id: req.body.id}).populate("photos")
            store.photos.forEach((e) => {
                Photo.findOneAndDelete({_id: e._id})
            })
            store.photos=[]
            store.save()
            res.status(200).json({store: store, status: "Success"})
        }
    } catch (err) {
        res.status(400).json({error:err})
    }
}
module.exports.deleteBlog = async (req, res) => {
    try {
        if(req.manager.roleTitle=="System Owner") {
            res.status(400).json({message: "System Owner role cannot be deleted.", status: "Success"})
        }
        else {
            Blog.findOneAndDelete({_id: req.body.id}, (error,result) => {
                if(error) {
                    res.status(400).json({error: error})
                }
                else {
                    res.status(200).json({result: result, status: "Success"})
                }  
            })
        }
    } catch (err) {
        res.status(400).json({error:err})
    }
}
module.exports.deleteDiscount = async (req, res) => {
    try {
        if(req.manager.roleTitle=="System Owner") {
            res.status(400).json({message: "System Owner role cannot be deleted.", status: "Success"})
        }
        else {
            Discount.findOneAndDelete({_id: req.body.id}, (error,result) => {
                if(error) {
                    res.status(400).json({error: error})
                }
                else {
                    res.status(200).json({result: result, status: "Success"})
                }  
            })
        }
    } catch (err) {
        res.status(400).json({error:err})
    }
}
module.exports.deleteManager = async (req, res) => {
    try {
        res.status(200).json({status: "Success"})
    } catch (err) {
        res.status(400).json({error:err})
    }
}

module.exports.editStore = async (req, res) => {
    if(req.manager.role.roleTitle=="System Owner")
    try {
        if(req.file) {
            //while(req.file.path.indexOf("\\")>=0) req.file.path.replace("\\","/")
            req.body.avatar = `/${req.file.path}`
        } 
        let result = await Store.findOneAndUpdate({_id: req.query.id},req.body)
        .then((result) => {  
            res.status(200).json({result: result,status: "Success"})
        }).catch(err =>  res.status(202).json({error:err, MESSAGE: "Fail to edit"}))
    } catch (err) {
        res.status(400).json({error:err})
    }
}

module.exports.editStoreType = async (req, res) => {
    if(req.manager.role.roleTitle=="System Owner")
    try {
        if(req.file) {
            //while(req.file.path.indexOf("\\")>=0) req.file.path.replace("\\","/")
            req.body.thumbnail = `/${req.file.path}`
        } 
        let result = await StoreType.findOneAndUpdate({_id: req.query.id},req.body)
        // .then((result) => {  
        //     res.status(200).json({result: result,status: "Success"})
        // })
        console.log(result)
        res.status(200).json({result: result,status: "Success"})
    } catch (err) {
        res.status(400).json({error:err})
    }
}

module.exports.editBlog = async (req, res) => {
    if(req.manager.role.roleTitle=="System Owner")
    try {
        if(req.file) {
            req.body.thumbnail = `/${req.file.path}`
        } 
        req.body.modifiedAt = new Date()
        let result = await Blog.findOneAndUpdate({_id: req.query.id},req.body)
        console.log(result)
        res.status(200).json({result: result,status: "Success"})
    } catch (err) {
        res.status(400).json({error:err})
    }
}

module.exports.editDiscount = async (req, res) => {
    if(req.manager.role.roleTitle=="System Owner")
    try {
        let result = await Discount.findOneAndUpdate({_id: req.query.id},req.body)
        result.save().then(() => {
            res.status(200).json({result: result,status: "Success"})
        })
    } catch (err) {
        res.status(400).json({error:err})
    }
}

module.exports.addStoreToDiscount = async (req, res) => {
    if(req.manager.role.roleTitle=="System Owner")
    try {
        let result = await Discount.findOne({_id: req.query.id})
        if(result.appliedStore.filter((e) => e==req.body.addedStore).length<1)
            result.appliedStore.push(req.body.addedStore)
        result.save().then(() => {
            res.status(200).json({result: result,status: "Success"})
        })
    } catch (err) {
        res.status(400).json({error:err})
    }
}

module.exports.hidePost = async (req, res) => {
    if(req.manager.role.roleTitle=="System Owner")
    try {
        let result = await Post.findOne({_id: req.query.id})
        result.isPublic=!result.isPublic
        result.save().then(() => {
            res.status(200).json({result: result,status: "Success"})
        })
    } catch (err) {
        res.status(400).json({error:err})
    }
}