const md5 = require('md5')
const bcrypt = require('bcrypt')
const Manager = require('../models/Manager.model')
const Feature = require('../models/Feature.model')
const Role = require('../models/Role.model')
const mongoose = require('mongoose')

let grantRoleAllFeature = async (roleId) => {
    let features = await Feature.find()
    let newFeatures = []
    for(let i=0; i<features.length; i++) {
        newFeatures.push(features[i]._id)
    }
    console.log(newFeatures)
    Role.findOneAndUpdate({_id: roleId}, {features: newFeatures}).then((result) => {
        return(result)
    })
}

module.exports.login = async (req, res) => {
    try {
        res.status(200).json({status: "Success"})
    } catch (err) {
        res.status(400).json({error:err})
    }
}
module.exports.logout = async (req, res) => {
    try {
        res.status(200).json({status: "Success"})
    } catch (err) {
        res.status(400).json({error:err})
    }
}
module.exports.logoutAll = async (req, res) => {
    try {
        res.status(200).json({status: "Success"})
    } catch (err) {
        res.status(400).json({error:err})
    }
}

module.exports.getMyInformation = async (req, res) => {
    try {
        res.status(200).json({status: "Success"})
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
module.exports.getAllManager  = async (req, res) => {
    try {
        const managers = await Manager.find().populate({path: 'role', populate: {
            path: 'features'
        }})
        res.status(200).json({managers: managers,status: "Success"})
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
        req.body._id= new mongoose.Types.ObjectId()
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

module.exports.changeRole  = async (req, res) => {
    try {
        res.status(200).json({status: "Success"})
    } catch (err) {
        res.status(400).json({error:err})
    }
}
module.exports.changeFeature  = async (req, res) => {
    try {
        res.status(200).json({status: "Success"})
    } catch (err) {
        res.status(400).json({error:err})
    }
}
module.exports.changeManager = async (req, res) => {
    try {
        res.status(200).json({status: "Success"})
    } catch (err) {
        res.status(400).json({error:err})
    }
}

module.exports.addFeatureToRole = async (req, res) => {
    try {
        const role = await Role.findOne({_id: req.query.roleId})
        if(!role.features.includes(req.body.featureId)) {
            Role.findOneAndUpdate({_id: req.query.roleId}, { $push: {"features":new mongoose.Types.ObjectId(req.body.featureId)}})
            .then( (result)  => { 
                res.status(200).json({feature: result, status: "Success"}) 
            }).catch((error) => {
                res.status(400).json({error:err})
            })
        }
        else {
            res.status(400).json({message: "The role already has the feature", status: "Failed"}) 
        }
    } catch (err) {
        res.status(400).json({error:err})
    }
}

module.exports.addAllFeaturesToRole = async (req, res) => {
    try {
        grantRoleAllFeature(req.query.roleId)
        res.status(200).json({message: "Grant all features.", status: "Success"}) 
    } catch (err) {
        res.status(400).json({error:err})
    }
}

module.exports.removeFeatureFromRole = async (req, res) => {
    try {
        let role = await Role.findOne({_id: req.query.roleId})
        role.features=role.features.filter(e => e.toString()!==req.body.featureId)
        console.log(role)
        Role.findOneAndUpdate({_id: req.query.roleId}, {features: role.features} ).then( (result)  => { 
            res.status(200).json({feature: result, status: "Success"}) 
        }).catch((error) => {
            res.status(400).json({error:err})
        })
    } catch (err) {
        res.status(400).json({error:err})
    }
}

module.exports.deleteFeature = async (req, res) => {
    try {
        Feature.findOneAndDelete({_id: req.body.id}, (error,result) => {
            if(error) {
                res.status(400).json({error:err})
            }
            else {
                res.status(200).json({result: result, status: "Success"})
            }  
        })
    } catch (err) {
        res.status(400).json({error:err})
    }
}
module.exports.deleteRole = async (req, res) => {
    try {
        let role = await Role.findOne({_id: req.body.id})
        if(role.roleTitle=="System Owner") {
            res.status(400).json({message: "System Owner role cannot be deleted.", status: "Success"})
        }
        else {
            Role.findOneAndDelete({_id: req.body.id}, (error,result) => {
                if(error) {
                    res.status(400).json({error:err})
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