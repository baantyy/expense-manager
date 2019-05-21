const mongoose = require("mongoose")
const { db } = require("./config")
mongoose.Promise = global.Promise
//mongodb://localhost:27017/expense-manager
//mongodb://banty:qwe123@ds145486.mlab.com:45486/heroku_x4jcrr0w
mongoose.connect("mongodb://banty:qwe123@ds145486.mlab.com:45486/heroku_x4jcrr0w",{
            useNewUrlParser: true,
            useCreateIndex: true
        })
        .then(function(){
            console.log("DB is connected")
        })
        .catch(function(){
            console.log("DB is not connected")
        })
        
module.exports = {
    mongoose
}