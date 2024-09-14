import catchAsyncErorr from "../middleware/catchAsyncErorr.js";
import userModel from "../model/user.schema.js";
import ErrorHandler from "../utils/errorHandler.js";
import { createClientQueue } from "../utils/queueManager.js";





// signUp
export const signUp = catchAsyncErorr(async (req, res, next) => {
  const { email, password } = req.body;

  // email and password validation
  if (!email || !password) {
    return next(
      new ErrorHandler("Please enter your email and password", 422)
    );
  }

  // email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return next(
      new ErrorHandler("Please enter a valid email format", 422)
    );
  }

  // password length validation
  if (password.length < 6 || password.length > 12) {
    return next(
      new ErrorHandler("Password should be at least 6 and at most 12 characters", 422)
    );
  }

  // check if user already exists
  const user = await userModel.findOne({ email });
  if (user) {
    return next(
      new ErrorHandler("This email is already registered", 422)
    );
  }

  // create the user
  const newAcc = await userModel.create(req.body);

  // add user to client queue
  createClientQueue(newAcc._id);

  // send success response
  res.status(201).json({
    message: "Account is created successfully",
    user: newAcc,
    token: newAcc.getJWTtoken(),
  });


});





// logged in

export const login = catchAsyncErorr(async (req, res, next) => {
  const { email, password } = req.body;

  // Check if email and password are provided
  if (!email || !password) {
    return next(
      new ErrorHandler("Please enter your email and password", 400)
    );
  }

  // Check for valid password length
  if (password.length < 6 || password.length > 12) {
    return next(new ErrorHandler("Password should be between 6 and 12 characters", 400));
  }

  // Fetch user from the database
  const user = await userModel.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("User does not exist", 400));
  }


  // Handle account lock after too many failed attempts
  if (user.failedLoginAttempts >= 5) {
    return next(new ErrorHandler("Account is locked due to too many failed login attempts", 403));
  }

  const isPasswordMatched = await user.comparePassword(password);

  // If password does not match
  if (!isPasswordMatched) {
    user.failedLoginAttempts += 1;
    await user.save(); // Save the failed attempts count
    return next(new ErrorHandler("Wrong Password", 404));
  }

  // Reset failed login attempts after successful login
  user.failedLoginAttempts = 0;
  await user.save();

  // Send response after successful login
  res.status(200).json({
    message: "Login successful",
    user: user,
    token: user.getJWTtoken(),
  });
});

// export const login = async (req, res, next) => {
//   const { email, password } = req.body;

//   try {

//     if (!email || !password) {
//       return next(
//         new ErrorHandler("Please enter your email or password", 400)
//       );
//     }

//     const user = await userModel.findOne({ email }).select("+password");
//     if (!user) {
//       return next(new ErrorHandler("User does not exist", 400));
//     }
//     const isPasswordMatched = await user.comparePassword(password);

//     if (!isPasswordMatched) {
//       return next(new ErrorHandler("Wrong Password", 404));
//     }

//     createClientQueue(newAcc._id);


//     res.status(200).json({
//       message: "Login successfull",
//       user: user,
//       token: user.getJWTtoken(),
//     });
//   } catch (err) {
//     res.status(422).json({
//       message: err.message,

//     });

//   }

// };


// log out
export const logout = catchAsyncErorr((req, res, next) => {

  res.json({
    message: "logout successfully",
    logout: true
  });
});


