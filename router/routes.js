
import { signUp } from '../controller/userContoller.js'
import userRouter from './userRouter.js' 
 
 const routes =(app)=>{
    app.get("/",(req,res)=>{
        res.status(200).send("🐲🐲nodejs and nginx working fine 🐲🐲 .")
        console.log("🐲🐲 Working fine 🐲🐲")
    })
    
    app.post("/api/v1/user/signup", signUp)
} 

export default routes