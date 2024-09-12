const app = require('./app')
 

// Handling Uncaught Exception
process.on("uncaughtException", (err) => {
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to Uncaught Exception`);
    process.exit(1);
  });

// Config
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({ path: "backend/config/config.env" });
}

const port  = process.env.PORT | 4000
  

// server code
app.listen(port,()=>{
    console.log(`server is runing at ${port}`);
})

 