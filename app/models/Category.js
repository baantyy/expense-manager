const mongoose = require("mongoose")
const uniqueValidator = require('mongoose-unique-validator')

const Schema = mongoose.Schema
const categorySchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: [true, 'category is required']
    }
})
categorySchema.plugin(uniqueValidator, { message: 'category already exists' })

const Category = mongoose.model("Category",categorySchema)
module.exports = {
    Category
}