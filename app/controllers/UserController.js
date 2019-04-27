const express = require("express")
const _ = require("lodash")
const router = express.Router()

const { User } = require("../models/User")

const { userAuth } = require("../middlewares/auth")

//localhost:3005/users/register
router.post("/register",function(req,res){
    const body = _.pick(req.body,["fullname","username","email","password"])
    body.passUpdate = true
    const user = new User(body)
    user.save()
        .then(function(user){
            res.send(user)
        })
        .catch(function(err){
            res.send(err)
        })
})

//localhost:3000/users/login
router.post("/login",function(req,res){
    const body = _.pick(req.body,["username_email","password"])
    User.findByCredentials(body.username_email,body.password)
        .then(function(user){
            return user.generateToken()
        })
        .then(function(user){
            res.send(user)
        })
        .catch(function(errors){
            res.send({errors})
        })
})

//localhost:3000/users/logout
router.delete("/logout",userAuth,function(req,res){
    const { user, token } = req
    User.findByIdAndUpdate(user._id,{ tokens: [] })
        .then(function(){
            res.send("Successfully logged out")
        })
        .catch(function(err){
            res.send(err)
        })
})

//localhost:3005/users/employee
router.get("/employee", userAuth, function(req,res){
    User.find().where('roles').in(['employee']).select('_id fullname')
        .then(function(users){
            res.send(users)
        })
        .catch(function(err){
            res.send(err)
        })
})

module.exports = {
    userRouter: router
}