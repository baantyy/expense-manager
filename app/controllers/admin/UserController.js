const express = require("express")
const _ = require("lodash")
const router = express.Router()

const { User } = require("../../models/User")

const { userAuth } = require("../../middlewares/auth")
const { adminAccess } = require("../../middlewares/access")

//localhost:3005/admin/users
router.get("/", userAuth, adminAccess, function(req,res){
    User.find()
        .then(function(users){
            res.send(users)
        })
        .catch(function(err){
            res.send(err)
        })
})

//localhost:3005/admin/users/:id
router.get("/:id", userAuth, adminAccess, function(req,res){
    const id = req.params.id
    User.findById(id)
        .then(function(user){
            res.send({user})
        })
        .catch(function(err){
            res.send(err)
        })
})

//localhost:3005/admin/users
router.post("/", userAuth, adminAccess, function(req,res){
    const body = _.pick(req.body,["fullname", "username", "email", "password", "roles", "allowAccess"])
    body.passUpdate = true
    const user = new User(body)
    user.save()
        .then(function(user){
            res.send({user})
        })
        .catch(function(errors){
            res.send(errors)
        })
})

//localhost:3005/admin/users/:id
router.put("/:id", userAuth, adminAccess, function(req,res){
    const id = req.params.id
    const body = _.pick(req.body,["fullname", "username", "email", "password", "roles", "allowAccess"])
    body.password === '' ? delete body.password : body.passUpdate = true
    User.findByIdAndUpdate(id, body, {new: true, runValidators: true, context: 'query'})
        .then(function(user){
            return body.password ? user.updatePassword() : user
        })
        .then(function(user){
            console.log('final',user)
            res.send(user)
        })
        .catch(function(errors){
            res.send(errors)
        })
})

//localhost:3005/admin/users/:id
router.delete("/:id", userAuth, adminAccess, function(req,res){
    const id = req.params.id
    User.findByIdAndDelete(id)
        .then(function(user){
            res.send({user})
        })
        .catch(function(err){
            res.send(err)
        })
})

module.exports = {
    adminUserRouter: router
}