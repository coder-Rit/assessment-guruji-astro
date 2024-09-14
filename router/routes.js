
import { applyToJob ,getJobs} from '../controller/jobController.js'
import { login, logout, signUp } from '../controller/userContoller.js'
import { isAuthenticated } from '../middleware/auth.js'
 
 const routes =(app)=>{
    app.get("/",(req,res)=>{
        res.status(200).send("🐲🐲nodejs and nginx working fine 🐲🐲 .")
        console.log("🐲🐲 Working fine 🐲🐲")
    })
    
    app.post("/api/v1/user/signup", signUp)
    app.post("/api/v1/user/login", login)
    app.get("/api/v1/user/logout",isAuthenticated, logout)



    app.get("/api/v1/job/get", getJobs)
    app.put("/api/v1/job/apply",isAuthenticated, applyToJob)
    // app.put("/api/v1/job/application/delete",isAuthenticated, deleteApplication)
} 

export default routes