const adminAccess = function(req, res, next) {    
    if(req.user.roles.includes("admin") || req.user.roles.includes("superadmin")){
        next()
    }else{
        res.status("403").send({error: "the page does not exist" })
    }
}

const superAdminAccess = function(req, res, next) {    
    if(req.user.roles.includes("superadmin")){
        next()
    }else{
        res.status("403").send({error: "the page does not exist" })
    }
}

module.exports = {
    adminAccess, superAdminAccess
}