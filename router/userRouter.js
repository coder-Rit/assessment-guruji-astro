const express = require('express')
const { signUp, login, logOut } = require('../controller/userContoller')

const Router = express.Router()

Router.route("/user/signup").post(signUp) 
Router.route("/user/login").post(login)
Router.route("/user/logout").get(logOut)
 

module.exports =Router