import { Queue } from "bullmq";
import catchAsyncErorr from "../middleware/catchAsyncErorr.js";

import ErrorHandler from "../utils/errorHandler.js";
import redisClient from "../config/redisClient.js";



// apply to job
export const applyToJob = async (req, res, next) => {

    try {
        if(!req.body.job_id){
            return next(
                new ErrorHandler("Job id missing", 404)
              );
        }
        addJobToQueue(req.user._id, {...req.body});

        res.status(201).json({
            status: true,
            message: "Applied",
        });

    } catch (error) {

        res.status().json({
            message: error,
            status: false
        });
    }
};

// export const deleteApplication = async (req, res, next) => {

//     try {
//         if(!req.body.job_id){
//             return next(
//                 new ErrorHandler("Job id missing", 404)
//               );
//         }
//         addJobToQueue(req.user._id, req.body);

//         res.status(201).json({
//             status: true,
//             message: "Applied",
//         });

//     } catch (error) {

//         res.status().json({
//             message: error,
//             status: false
//         });
//     }
// };




function createClientQueue(clientId) {
    return new Queue(`queue_${clientId}`, {
        redis: redisClient,
    });
}

function addJobToQueue(clientId, jobData) {
    const clientQueue = createClientQueue(clientId);
    clientQueue.add(JSON.stringify(jobData));

}


