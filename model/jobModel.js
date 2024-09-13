import mongoose from 'mongoose';
import validator from 'validator';

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Job title is required"],
        trim: true,
        maxLength: [100, "Job title cannot exceed 100 characters"]
    },
    company: {
        type: String,
        required: [true, "Company name is required"],
        trim: true,
        maxLength: [100, "Company name cannot exceed 100 characters"]
    },
    salary: {
        type: Number,
        required: false
    },
    postedAt: {
        type: Date,
        default: Date.now
    }
});

const jobModel = mongoose.model('Job', jobSchema);

export default jobModel;
