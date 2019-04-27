const express = require("express")
const _ = require("lodash")
const router = express.Router()

const { Expense } = require("../models/Expense")
const { userAuth } = require("../middlewares/auth")

// upload receipt
const multer  = require('multer')
const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null, "uploads")
    },
    filename: function(req,file,cb){
        cb(null, Number(new Date()) + '_' + file.originalname)
    }
})
const fileFilter = (req,file,cb) => {
    if(file.mimetype == 'image/jpeg' || file.mimetype == 'image/png'){
        cb(null,true)
    }else{
        cb(null,false)
    }
}
const upload = multer({
    storage, 
    limits: { fileSize: 1024 * 1024 * 5 },
    fileFilter
})

//localhost:3005/expenses
router.get("/", userAuth, function(req,res){
    Expense.find({ "colleagues.user": req.user._id })
           .populate('user','fullname')
           .populate('category','name')
           .populate('colleagues.user', 'fullname')
        .then(function(expenses){
            res.send(expenses)
        })
        .catch(function(error){
            res.send({error})
        })
})

//localhost:3005/expenses/:id
router.get("/:id", userAuth, function(req,res){
    const id = req.params.id
    Expense.findOne({ _id: id, "colleagues.user": req.user._id })
           .populate('user','fullname')
           .populate('category','name')        
           .populate('colleagues.user', 'fullname')
        .then(function(expense){
            res.send(expense)
        })
        .catch(function(err){
            res.send(err)
        })
})

//localhost:3005/expenses
router.post("/", userAuth, function(req,res){
    const body = _.pick(req.body,["category", "reason", "colleagues"])
    body.user = req.user._id
    const expense = new Expense(body)
    expense.save()
        .then(function(expense){
            res.send(expense)
        })
        .catch(function(err){
            res.send(err)
        })
})

//localhost:3005/expenses/:id
router.put("/:id", userAuth, upload.single("receipt"), function(req,res){
    const id = req.params.id
    const body = _.pick(req.body,["amountSpent","receipt"])
    if(req.file){
        body.receipt = req.file.filename
    }
    Expense.findOneAndUpdate({
            _id: id,
            "colleagues.user": req.user._id
        }, { $set: { 
            "colleagues.$.amountSpent": body.amountSpent,
            "colleagues.$.receipt": body.receipt
        }}, {new: true, runValidators: true})
        .then(function(expense){
            res.send(expense)
        })
        .catch(function(err){
            res.send(err)
        })
})

module.exports = {
    expenseRouter: router
}