import express from 'express'
import { signUp, login, logout } from '../controller/userContoller.js'

const Router = express.Router()

Router.route("/user/signup").post(signUp) 
Router.route("/user/login").post(login)
Router.route("/user/logout").get(logout)
 

export default  Router