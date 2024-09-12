const mongoose = require("mongoose")


const connectTODatabase_app = ()=>{
    mongoose.connect(process.env.DB_URI_app).then(()=>{
        console.log(`Database connected successfull`);
    }).catch(err=>console.log(`db error ${err}`))
}

 

module.exports = connectTODatabase_app
         