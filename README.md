# Backend Developer Intern Assessment by Guruji Astro

## Project Overview
This project is a simple recruitment platform where users must authenticate themselves before applying for opportunities. The project is divided into four repositories:
Client
Primary Server
Worker
Email Server

## High-Level Design

img

## Requirements Fulfillment
1. User Authentication:✅ Implemented
2. Request Queueing:✅Implemented using Redis and Bull.
3. Request Processing: ✅The worker processes requests.
4. Concurrency Management: ✅ The worker manages the client queue efficiently.
5. Scalability:  ✅Workers can be spawned on EC2 instances.
6. Robustness:  ✅Error handling implemented.
7. Logging and Monitoring: ⛔ Not yet implemented.

## Tools and Technologies I have used:
- Programming Language: Node.js 
- Messaging/Queueing System: Redis
- Database: MongoDB
- Monitoring Tools: None


## System Design:
- Client-Server Model:  ✨Achieved
- Queue Management:  ✨Achieved
- Worker Processes:  ✨Achieved

## Assignment Tasks:
1. System Architecture:✅Completed
   
2. Implementation:✅Completed
   
3. Testing:✅API tested using Jest and Supertest.
    
4. Deployment:✅ CI/CD pipeline implemented using GitHub Actions. The Docker image is automatically updated.  

## Flow Diagrams:
1. Overall System Flow :
img
2. Detailed Process Flow :
img

## Current Issues with project:
While the worker servers can fetch and process API requests, they cannot post data into MongoDB. Despite multiple attempts, the connection appears to be working fine, but an error persists:
```bash
MongooseError: Operation `users.findOne()` buffering timed out after 10000ms
```
This error occurs during the worker's attempt to communicate with the MongoDB database, indicating a timeout issue. I have investigated potential causes, but resolving this error requires further debugging.


 
