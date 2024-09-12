module.exports = (user, res, msg, statusCode,req) => {
  const Token = user.getJWTtoken();
 
  res.status(statusCode).json({
    msg: msg,
    user: user,
    Token: Token,
  });
};
