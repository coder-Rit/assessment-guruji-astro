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
    password: 'testpass'
}

const userId = new mongoose.Types.ObjectId().toString();
const userPayload = {
    message: "Account is crated successfully",
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
        expect(body.message).toBe('Account is created successfully');
        expect(statusCode).toBe(201);
        expect(body.user).toBeDefined();
        // expect(body.Token).toBeDefined();


    });

    it('should return 422 if email or password is missing', async () => {
        const { statusCode, body } = await supertest(app)
            .post("/api/v1/user/signup")
            .send({ email: 'test@example.com' }); // Missing password

        expect(statusCode).toBe(422);
        expect(body.message).toBe("Please enter your email and password");

        const { statusCode: statusCode2, body: body2 } = await supertest(app)
            .post("/api/v1/user/signup")
            .send({ password: 'testpassword123' }); // Missing email

        expect(statusCode2).toBe(422);
        expect(body2.message).toBe("Please enter your email and password");
    });

    it('should return 422 if the email is already registered', async () => {
        userModel.findOne.mockResolvedValue(userPayload); // Simulate user already exists

        const { statusCode, body } = await supertest(app)
            .post("/api/v1/user/signup")
            .send(signUpRequestBody);

        expect(statusCode).toBe(422);
        expect(body.message).toBe("This email is already registered");
    });

    it('should return 422 if the email format is invalid', async () => {
        const invalidEmailRequestBody = {
            email: 'invalilpdemail',
            password: 'testpassword123'
        };
        userModel.findOne.mockResolvedValue(null);
        userModel.create.mockResolvedValue(userPayload);  

        const { statusCode, body } = await supertest(app)
            .post("/api/v1/user/signup")
            .send(invalidEmailRequestBody);

        expect(body.message).toBe("Please enter a valid email format");
        expect(statusCode).toBe(422);
    });

    it('should return 422 if the password is too short or too big', async () => {
        const shortPasswordRequestBody = {
            email: 'test@example.com',
            password: '123'
        };

        const { statusCode, body } = await supertest(app)
            .post("/api/v1/user/signup")
            .send(shortPasswordRequestBody);

        expect(statusCode).toBe(422);
        expect(body.message).toBe("Password should be at least 6 and at most 12 characters");
    });

    it('should return 422 if there is an error during user creation', async () => {
        userModel.findOne.mockResolvedValue(null); // Simulate no user found
        userModel.create.mockRejectedValue(new Error("Database error")); // Simulate error during creation

        const { statusCode, body } = await supertest(app)
            .post("/api/v1/user/signup")
            .send(signUpRequestBody);

        expect(statusCode).toBe(422);
        expect(body.message).toBe("Database error");
    });


});