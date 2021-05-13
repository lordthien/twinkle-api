const md5 = require('md5')
const bcrypt = require('bcrypt')
const Manager = require('../models/Manager.model')
const Feature = require('../models/Feature.model')
const Role = require('../models/Role.model')
const Store = require('../models/Store.model')
const mongoose = require('mongoose')
const shortid = require('shortid')
const sgMail = require('@sendgrid/mail')
const StoreType = require('../models/StoreType.model')

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
module.exports.getAllStoreTypes  = async (req, res) => {
    try {
        const storeTypes = await StoreType.find()
        res.status(200).json({storeTypes: storeTypes,status: "Success"})
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
module.exports.createCoupon = async (req, res) => {
    try {
        res.status(200).json({status: "Success"})
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