const express = require("express")
const _ = require("lodash")
const router = express.Router()

const { Expense } = require("../../models/Expense")

const { userAuth } = require("../../middlewares/auth")
const { adminAccess, superAdminAccess } = require("../../middlewares/access")

//localhost:3005/admin/expenses
router.get("/", userAuth, adminAccess, function(req,res){
    Expense.find()
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

//localhost:3005/admin/expenses/:id
router.get("/:id", userAuth, adminAccess, function(req,res){
    const id = req.params.id
    Expense.findById(id)
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

//localhost:3005/admin/expenses
router.post("/", userAuth, adminAccess, function(req,res){
    const body = _.pick(req.body,["user", "budget", "category", "reason", "colleagues","isApproved"])
    const expense = new Expense(body)
    expense.save()
        .then(function(expense){
            res.send(expense)
        })
        .catch(function(err){
            res.send(err)
        })
})

//localhost:3005/admin/expenses/:id
router.put("/:id", userAuth, adminAccess, function(req,res){
    const id = req.params.id
    const body = _.pick(req.body,["user", "budget", "category", "reason", "colleagues", "isApproved"])
    Expense.findByIdAndUpdate(id, body, {new: true, runValidators: true})
        .then(function(expense){
            res.send(expense)
        })
        .catch(function(err){
            res.send(err)
        })
})

//localhost:3005/admin/expenses/:id
router.delete("/:id", userAuth, superAdminAccess, function(req,res){
    const id = req.params.id
    Expense.findByIdAndDelete(id)
        .then(function(expense){
            res.send({expense})
        })
        .catch(function(err){
            res.send(err)
        })
})

module.exports = {
    adminExpenseRouter: router
}