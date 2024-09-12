const catchAsyncErorr = require("../middleware/catchAsyncErorr");
 
const userModel = require("../model/userModel");
const ErrorHandler = require("../utils/errorHandler");
const sendJwt = require("../utils/sendJwt");


// signUp
exports.signUp = catchAsyncErorr(async (req, res, next) => {  
    const {email,password} = req.body;

    if (!email || !password) {
      return next(
        new ErrorHandler("Please enter your email and password", 422)
      );
    } 
    const user = await userModel.findOne({email});

    if (user) {
      return next(
        new ErrorHandler("This email is aleady registerd", 422)
      );
    } 

    const newAcc = await userModel.create(req.body);

    sendJwt(newAcc, res, "Account is crated successfully", 201, req);
  
}); 
 
 
// logged in
exports.login = catchAsyncErorr(async (req, res, next) => {
   const { email, password } = req.body;
  
   if (!email || !password) {
     return next(
       new ErrorHandler("Please enter your email or password", 400)
     );
   } 

   const user = await userModel.findOne({ email }).select("+password"); 
   if (!user) {
     return next(new ErrorHandler("User does not exist", 400));
   }
   const isPasswordMatched = await user.comparePassword(password);

   if (!isPasswordMatched) {
     return next(new ErrorHandler("Wrong Password", 404));
   }
 
  sendJwt(user, res, "LogeIn Successfully", 200, req);
});
 
// log out
exports.logOut = catchAsyncErorr((req, res, next) => {
  
  res.json({
      msg: "logout successfully",
      logOut:true
    });
});

 
