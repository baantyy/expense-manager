const express = require("express")
const router = express.Router()

//controllers
const { adminUserRouter } = require('../app/controllers/admin/UserController')
const { adminExpenseRouter } = require('../app/controllers/admin/ExpenseController')
const { adminCategoryRouter } = require('../app/controllers/admin/CategoryController')

const { userRouter } = require('../app/controllers/UserController')
const { expenseRouter } = require('../app/controllers/ExpenseController')

//routes
router.use("/admin/users", adminUserRouter)
router.use("/admin/expenses", adminExpenseRouter)
router.use("/admin/categories", adminCategoryRouter)

router.use("/users", userRouter)
router.use("/expenses", expenseRouter)

module.exports = {
    routes: router
}