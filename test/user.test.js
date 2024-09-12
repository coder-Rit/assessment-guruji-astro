import supertest from 'supertest'
import createServer from "../utils/createServer.js";
import * as userContoller from "../controller/userContoller.js";
import mongoose from 'mongoose';
import userModel from '../model/userModel.js';

jest.mock('../model/userModel.js'); // Mocking the userModel

const app = createServer();

// Example request body for sign-up
const signUpRequestBody = {
    email: 'test@example.com',
    password: 'testpassword123'
};

const userId = new mongoose.Types.ObjectId().toString();
const userPayload = {
    message:"Account is crated successfully",
    user: {
        _id: userId,
        email: "test@example.com",
    },
    // Token: String

};


describe('POST /api/v1/user/signup', () => {

    it('should return success for valid sign-up request', async () => {



        userModel.findOne.mockResolvedValue(null); // Simulate no user found
        userModel.create.mockResolvedValue(userPayload); // Simulate successful user creation


        const { statusCode, body } = await supertest(app)
            .post("/api/v1/user/signup")
           .send(signUpRequestBody);


        // Check for a 201 response status
        expect(statusCode).toBe(201);
        expect(body.message).toBe('Account is crated successfully');
        expect(body.user).toBeDefined();
        // expect(body.Token).toBeDefined();

        // expect(createUserServiceMock).toHaveBeenCalledWith(signUpRequestBody);

    });

});