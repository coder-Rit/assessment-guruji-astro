const userModel = require("../model/userModel.js")
const ErrorHandler = require("../utils/errorHandler.js")
const jwt = require('jsonwebtoken')
const catchAsyncErorr = require("./catchAsyncErorr.js") 

const isAuthenticated = catchAsyncErorr(async(req,res,next)=>{
    const {token} = req.cookies 
    if (!token) {
        next(new ErrorHandler("Please login to access this source",400))
    }
    
    const decoded =  jwt.verify(token,process.env.JWT_SECREATE)
  
    req.user =  await userModel.findById(decoded.id)
     next()
    
})

const authorizedRole = (...Role)=>{
  return  (req,res,next)=>{
        if (!Role.includes(req.user.role)) {
            return next( new ErrorHandler(`${req.user.role} is not allowed to access this source` ))
        }
        next()
    }
}

export default {isAuthenticated,authorizedRole}