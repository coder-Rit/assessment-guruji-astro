import catchAsyncErorr from "../middleware/catchAsyncErorr.js";
import userModel from "../model/user.schema.js";
import ErrorHandler from "../utils/errorHandler.js";
import jwt from 'jsonwebtoken';

export const isAuthenticated = catchAsyncErorr(async (req, res, next) => {
    const { token } = req.cookies

    if (!token) {
        next(new ErrorHandler("Please login to access this source", 400))
    }

    const decoded = jwt.verify(token, process.env.JWT_SECREATE)

    req.user = await userModel.findById(decoded.id)
    next()

})
 