import ErrorHandler from "../utils/errorHandler.js";


const error = (err,req,res,next)=>{
  err.message = err.message || "Internal server error"
  err.statusCode = err.statusCode ||500


  
// Wrong Mongodb Id error
if (err.name === "CastError") {
  const message = `Resource not found. Invalid: ${err.path}`;
  err = new ErrorHandler(message, 400);
}

// Mongoose duplicate key error
if (err.code === 11000) {
  const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
  err = new ErrorHandler(message, 400);
}

// Wrong JWT error
if (err.name === "JsonWebTokenError") {
  const message = `Json Web Token is invalid, Try again `;
  err = new ErrorHandler(message, 400);
}

// JWT EXPIRE error
if (err.name === "TokenExpiredError") {
  const message = `Json Web Token is Expired, Try again `;
  err = new ErrorHandler(message, 400);
}


  res.status(err.statusCode).json({
      message:err.message
  })
}



export default error; 