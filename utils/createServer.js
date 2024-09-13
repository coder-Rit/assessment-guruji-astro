import express from "express";
import routes from "../router/routes.js";

import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import cors from "cors"
import error from "../middleware/error.js";


function createServer() {
  const app = express();


  app.use(cors({
    credentials: true,
    origin: [process.env.ORIGIN_1, process.env.ORIGIN_2, process.env.ORIGIN_3]
  }))

  app.use(express.json())
  app.use(cookieParser())
  app.use(bodyParser.urlencoded({ extended: true }))

  routes(app);
  app.use(error)
  return app;
}

export default createServer;