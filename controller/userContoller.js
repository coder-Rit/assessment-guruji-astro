import { Queue } from "bullmq";
import catchAsyncErorr from "../middleware/catchAsyncErorr.js";
import userModel from "../model/userModel.js";
import ErrorHandler from "../utils/errorHandler.js";
import redisClient from "../config/redisClient.js";


// signUp
export const signUp = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !password) {
      return next(
        new ErrorHandler("Please enter your email and password", 422)
      );
    }

    if (!emailRegex.test(email)) {
      return next(
        new ErrorHandler("Please enter a valid email format", 422)
      );
    }
    if (password.length < 6 ||password.length > 12) {
      return next(
        new ErrorHandler("Password should be at least 6 and at most 12 characters", 422)
      );
    }

    const user = await userModel.findOne({ email });

    if (user) {
      return next(
        new ErrorHandler("This email is already registered", 422)
      );
    }

    const newAcc = await userModel.create(req.body);

    res.status(201).json({
      message: "Account is created successfully",
      user: newAcc,
      //Token: newAcc.getJWTtoken(),
    });
  } catch (err) {
    res.status(422).json({
      message: err.message,
    });
  }
};




// logged in
export const login = catchAsyncErorr(async (req, res, next) => {
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

  createClientQueue(user._id)

  res.status(200).json({
    message: "Login successfull",
    user: user,
    Token: user.getJWTtoken(),
  });

});


// log out
export const logout = catchAsyncErorr((req, res, next) => {

  res.json({
    message: "logout successfully",
    logout: true
  });
});




function createClientQueue(clientId) {
  return new Queue(`queue_${clientId}`, {
    redis: redisClient,
  });
}

