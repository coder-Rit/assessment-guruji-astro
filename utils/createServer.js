import express from "express";
import routes from "../router/routes.js";

import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import cors from "cors"
import error from "../middleware/error.js";
import dotenv from "dotenv";


function createServer() {
  const app = express();



  dotenv.config({ path: "./config/config.env" });

  app.use(express.json())
  app.use(cookieParser())
  app.use(bodyParser.urlencoded({ extended: true }))

  app.use(cors({
    origin: [process.env.ORIGIN_CLIENT, process.env.ORIGIN_WORKER, process.env.ORIGIN_3],
    credentials: true,
  }))

  routes(app);
  app.use(error)
  return app;
}

export default createServer;