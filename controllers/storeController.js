const Store = require('../models/Store.model')
const mongoose = require('mongoose')
const Service = require('../models/Service.model')
const Staff = require('../models/Staff.model')
const shortid = require('shortid')
const sgMail = require('@sendgrid/mail')

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
        res.status(200).json({ store: req.store, status: "Success" })
    } catch (err) {
        res.status(400).json({ error: err })
    }
}

module.exports.getAllStaffs = async (req, res) => {
    try {
        let staffs = await Staff.find().populate("services")
        res.status(200).json({ staffs: staffs, status: "Success" })
    } catch (err) {
        res.status(400).json({ error: err })
    }
}

module.exports.getAllServices = async (req, res) => {
    try {
        let services = await Service.find()
        res.status(200).json({ services: services, status: "Success" })
    } catch (err) {
        res.status(400).json({ error: err })
    }
}

module.exports.getAllBooks = async (req, res) => {
    try {
        res.status(200).json({ stores: stores, status: "Success" })
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

module.exports.getBookById = async (req, res) => {
    try {
        res.status(200).json({ stores: stores, status: "Success" })
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

module.exports.editService = async (req, res) => {
    try {
        if (req.file) {
            // while(req.file.path.indexOf("\\")>=0) req.file.path.replace("\\","/")
            req.body.thumbnail = `/${req.file.path.replace(/\\/g, "/")}`
        }
        let result = await Service.findOneAndUpdate({_id: req.query.id },req.body)
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
module.exports.removeService = async (req, res) => {
    try {
        let result = await Staff.findOne({_id: req.query.id })
        result.services=result.services.filter((e) => {
            if(e.toString()!==req.body.serviceId) return e
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

module.exports.deleteStaff = async (req, res) => {
    try {
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
