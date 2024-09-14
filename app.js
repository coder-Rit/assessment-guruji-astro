import error from './middleware/error.js'
import logger from "./utils/logger.js";
import createServer from './utils/createServer.js'
import primaryConnection from './config/db.primary.connet.js';
import dotenv from 'dotenv'
import http from 'http'
import { Server } from 'socket.io';
import io from 'socket.io-client';



dotenv.config({ path: "./config/config.env" });


const app = createServer();

const port = process.env.PORT || 4000;




app.listen(port, async () => {
  logger.info(`App is running at http://localhost:${port}`);

  await primaryConnection(process.env.DB_URI_APP, {});

  
  const server1 = new Server(4001,{
    cors:{
    origin: [process.env.ORIGIN_CLIENT, process.env.ORIGIN_WORKER, process.env.ORIGIN_3],
    credentials:true
  }});  

  server1.on('connection', (socket) => {

    socket.on('JOB_STATUS', (data) => {
      console.log('JOB_STATUS Received :', data);
      // Broadcast the message to all connected clients
      
      server1.in(data.user_id).emit('JOB_STATUS_FROM_SERVER', data);
    });

 
    socket.on('takeUser', (data) => {
      console.log('Received message from client1:', data); 
      if (data && data.user_id) {
        console.log(data.user_id);
        socket.join(data.user_id);
      }
    });
    

  });
 

});



export default app
