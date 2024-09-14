import supertest from 'supertest';
import createServer from "../utils/createServer.js";
import * as queueManager from '../utils/queueManager.js';
import mongoose from 'mongoose';
import jobModel from '../model/job.schema.js';
import userModel from '../model/user.schema.js';
import jwt from 'jsonwebtoken';

jest.mock('../model/job.schema.js');
jest.mock('../model/user.schema.js');
jest.mock('../utils/queueManager.js');

const app = createServer();

const userId = new mongoose.Types.ObjectId().toString();
const jobId = new mongoose.Types.ObjectId().toString();
const userPayload = {
    _id: userId,
    email: 'test@example.com',
    password: 'testpass',
};

const jobPayload = {
    _id: jobId,
    title: "Software Engineer",
    company: "Tech Corp",
    salary: 100000,
    applied: [],
    postedAt: new Date(),
};

// Mock token generation
const mockedToken = "mocked-jwt-token";
jwt.verify = jest.fn().mockReturnValue({ id: userId });

describe('GET /api/v1/job/get', () => {
    it('should return jobs successfully', async () => {
        jobModel.find.mockResolvedValue([jobPayload]); // Simulate successful job fetching

        const { statusCode, body } = await supertest(app)
            .get('/api/v1/job/get');

        expect(statusCode).toBe(200);
        expect(body.jobs).toHaveLength(1);
        expect(body.jobs[0].title).toBe(jobPayload.title);
    });

    it('should return 500 if there is a database error', async () => {
        jobModel.find.mockRejectedValue(new Error('Database error'));

        const { statusCode, body } = await supertest(app)
            .get('/api/v1/job/get');

        expect(statusCode).toBe(500);  // Update to expect 500
        expect(body.message).toBe('Database error');
    });
});

describe('PUT /api/v1/job/apply', () => {
    beforeEach(() => {
        // Mock user fetching after authentication
        userModel.findById.mockResolvedValue(userPayload);
    });

    it('should apply to a job successfully', async () => {
        jobModel.findById.mockResolvedValue(jobPayload); // Simulate job found
        queueManager.addClientProcessingRequest.mockResolvedValue();
        queueManager.addJobToQueue.mockResolvedValue();

        const { statusCode, body } = await supertest(app)
            .put('/api/v1/job/apply')
            .set('Cookie', [`token=${mockedToken}`]) // Mocking authenticated request
            .send({ job_id: jobId });

        expect(statusCode).toBe(201);
        expect(body.message).toBe('Applied');
        expect(queueManager.addJobToQueue).toHaveBeenCalledWith(userId, { job_id: jobId });
    });

    it('should return 404 if job_id is missing', async () => {
        const { statusCode, body } = await supertest(app)
            .put('/api/v1/job/apply')
            .set('Cookie', [`token=${mockedToken}`]) // Mocking authenticated request
            .send({}); // Missing job_id

        expect(statusCode).toBe(404);
        expect(body.message).toBe('Job id missing');
    });

    it('should return 400 if the user is unauthenticated', async () => {
        const { statusCode, body } = await supertest(app)
            .put('/api/v1/job/apply')
            .send({ job_id: jobId });

        expect(statusCode).toBe(400);
        expect(body.message).toBe('Please login to access this source');
    });

     
});
