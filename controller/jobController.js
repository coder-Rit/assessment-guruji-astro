import catchAsyncErorr from "../middleware/catchAsyncErorr.js";

import ErrorHandler from "../utils/errorHandler.js";
import { addClientProcessingRequest, addJobToQueue } from "../utils/queueManager.js";
import jobModel from "../model/job.schema.js";





// apply to job
export const applyToJob = catchAsyncErorr(async (req, res, next) => {

    if (!req.body.job_id) {
        return next(
            new ErrorHandler("Job id missing", 404)
        );
    }
    addClientProcessingRequest(req.user._id)
    addJobToQueue(req.user._id, req.body);

    res.status(201).json({
        status: true,
        message: "Applied",
    });

})


// apply all jobs
export const getJobs = catchAsyncErorr(async (req, res, next) => {
    // manully added jobs
    const jobs = await jobModel.find({});
    res.status(200).json({
        jobs
    });

});
