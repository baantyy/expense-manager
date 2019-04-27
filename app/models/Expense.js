const mongoose = require("mongoose")

const Schema = mongoose.Schema
const expenseSchema = new Schema({
    createdAt: {
        type: Date,
        default: Date.now
    },
    budget: {
        type: Number,
        default: 0
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'category is required']
    },
    reason: {
        type: String,
        required: [true, 'reason is required']
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'employer is required']
    },
    isApproved: {
        type: Boolean,
        default: false
    },
    colleagues: [{
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        amountSpent: {
            type: Number,
            default: 0
        },
        amountReceived: {
            type: Number,
            default: 0
        },
        receipt: {
            type: String,
            default: 'null'
        }
    }]
})

//before saving
expenseSchema.pre("save",function(next){
    const expense = this
    if(expense.isNew){
        expense.colleagues.push({
            user: expense.user
        })
        next()
    }else{
        if(expense)
        next()
    }
})

const Expense = mongoose.model("Expense",expenseSchema)
module.exports = {
    Expense
}