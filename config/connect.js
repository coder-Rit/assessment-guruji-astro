import mongoose from "mongoose";
import logger from "../utils/logger.js";

async function connect() {

  try {
    await mongoose.connect(process.env.DB_URI_app);
    logger.info("DB connected");
  } catch (error) {
    logger.error("Could not connect to db");
    process.exit(1);
  }
}

export default connect;