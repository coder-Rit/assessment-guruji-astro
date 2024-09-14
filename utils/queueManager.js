import { Queue } from "bullmq";

export const createClientQueue = (user_id) => {
    return new Queue(`queue_${user_id}`, {
        connection: {
            host: "127.0.0.1",
            port: 6379,
          
        }
    });
}


export const addJobToQueue = (user_id, jobData) => {
    const clientQueue = createClientQueue(user_id);
    clientQueue.add(JSON.stringify(jobData));
} 


export const addClientProcessingRequest = (userId) => {
    // Create a queue specifically for worker_1 and the given client ID
    const worker1Queue = new Queue(`worker_1_clients`, {
      connection: {
        host: "127.0.0.1",
        port: 6379,
      }
    });
  
    // Add the job data to the worker_1 queue
    worker1Queue.add(JSON.stringify(userId));
  };