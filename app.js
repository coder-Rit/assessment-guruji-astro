import express  from 'express'
import error  from './middleware/error.js'
import logger from "./utils/logger.js";
import createServer  from'./utils/createServer.js'
import connect from './utils/connect.js';

import("dotenv").then((dotenv) => {
  dotenv.config({ path: "config/config.env" });
});


const app = createServer();

const port  = process.env.port || 4000;

app.listen(port, async () => {
  logger.info(`App is running at http://localhost:${port}`);

  await connect();
});
 
 
app.use(error)
export default app
