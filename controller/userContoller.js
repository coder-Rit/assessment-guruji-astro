import catchAsyncErorr from "../middleware/catchAsyncErorr.js";

import userModel from "../model/userModel.js";
import ErrorHandler from "../utils/errorHandler.js";
import sendJwt from "../utils/sendJwt.js";




// signUp
export const signUp = async (req, res, next) => {
  console.log("reac");

  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(
        new ErrorHandler("Please enter your email and password", 422)
      );
    }
    const user = await userModel.findOne({ email });

    if (user) {
      return next(
        new ErrorHandler("This email is aleady registerd", 422)
      );
    }

    const newAcc = await userModel.create(req.body);



    res.status(201).json({
      message: "Account is crated successfully",
      user: user,
      // Token: user.getJWTtoken() | "",
    });

  } catch (error) {
    console.log(error);

    res.status(422).json({
      message: "error",
      err: error,
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

  res.status(200).json({
    message: "Login successfull",
    user: user,
    // Token: user.getJWTtoken() | "",
  });
});

// log out
export const logout = catchAsyncErorr((req, res, next) => {

  res.json({
    message: "logout successfully",
    logout: true
  });
});



