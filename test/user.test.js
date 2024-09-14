import supertest from 'supertest'
import createServer from "../utils/createServer.js";
import * as userContoller from "../controller/userContoller.js";
import mongoose from 'mongoose';
import userModel from '../model/user.schema.js';

jest.mock('../model/user.schema.js'); // Mocking the user.schema.js

const app = createServer();

// Example request body for sign-up

const signUpRequestBody = {
    email: 'test@example.com',
    password: 'testpass'
}

const userId = new mongoose.Types.ObjectId().toString();
const userPayload = {
    _id: userId,
    email: 'test@example.com',
    password: 'testpass',
    comparePassword: jest.fn(), // Mock comparePassword method
    getJWTtoken: jest.fn().mockReturnValue("mocked-jwt-token"), // Mock JWT token generation
    save: jest.fn().mockResolvedValue(true)
};


describe('POST /api/v1/user/signup', () => {
    it('should return success for valid sign-up request', async () => {
        userModel.findOne.mockResolvedValue(null); // Simulate no user found
        userModel.create.mockResolvedValue(userPayload); // Simulate successful user creation

        const { statusCode, body } = await supertest(app)
            .post("/api/v1/user/signup")
            .send(signUpRequestBody);

        expect(statusCode).toBe(201); // Created
        expect(body.message).toBe('Account is created successfully');
        expect(body.user).toBeDefined();
        expect(body.token).toBeDefined();
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
            email: 'invalidemail',
            password: 'testpassword123'
        };

        userModel.findOne.mockResolvedValue(null); // Simulate no user found

        const { statusCode, body } = await supertest(app)
            .post("/api/v1/user/signup")
            .send(invalidEmailRequestBody);

        expect(statusCode).toBe(422);
        expect(body.message).toBe("Please enter a valid email format");
    });

    it('should return 422 if the password is too short or too long', async () => {
        const shortPasswordRequestBody = {
            email: 'test@example.com',
            password: '123'
        };

        const longPasswordRequestBody = {
            email: 'test@example.com',
            password: 'thispasswordiswaytoolong'
        };

        const { statusCode, body } = await supertest(app)
            .post("/api/v1/user/signup")
            .send(shortPasswordRequestBody);

        expect(statusCode).toBe(422);
        expect(body.message).toBe("Password should be at least 6 and at most 12 characters");

        const { statusCode: statusCode2, body: body2 } = await supertest(app)
            .post("/api/v1/user/signup")
            .send(longPasswordRequestBody);

        expect(statusCode2).toBe(422);
        expect(body2.message).toBe("Password should be at least 6 and at most 12 characters");
    });

    it('should return 500 if there is a server error during sign-up', async () => {
        userModel.findOne.mockRejectedValue(new Error("Database error")); // Simulate server error during user check

        const { statusCode, body } = await supertest(app)
            .post("/api/v1/user/signup")
            .send(signUpRequestBody);

        expect(statusCode).toBe(500);
        expect(body.message).toBe("Database error");
    });
});

describe('POST /api/v1/user/login', () => {

    const loginRequestBody = {
        email: 'test@example.com',
        password: 'testpass'
    };

    it('should return success for valid login request', async () => {
        const mockSelect = jest.fn().mockResolvedValue(userPayload); // Mocking the .select() method
    
        userModel.findOne.mockReturnValue({ select: mockSelect }); // Mock findOne to return an object with select()
    
        userPayload.comparePassword.mockResolvedValue(true); // Simulate correct password
    
        const { statusCode, body } = await supertest(app)
            .post("/api/v1/user/login")
            .send(loginRequestBody);
    
            expect(body.message).toBe('Login successful');
        expect(statusCode).toBe(200);
        expect(body.user).toBeDefined();
        expect(body.token).toBeDefined();
        expect(body.token).toBe("mocked-jwt-token");
    });
    

    it('should return 400 if email or password is missing', async () => {
        const { statusCode, body } = await supertest(app)
            .post("/api/v1/user/login")
            .send({ email: 'test@example.com' }); // Missing password

            expect(body.message).toBe("Please enter your email and password");
        expect(statusCode).toBe(400);

        const { statusCode: statusCode2, body: body2 } = await supertest(app)
            .post("/api/v1/user/login")
            .send({ password: 'testpass' }); // Missing email

        expect(statusCode2).toBe(400);
        expect(body2.message).toBe("Please enter your email and password");
    });

    it('should return 400 if the password length is invalid', async () => {
        const invalidPasswordRequestBody = {
            email: 'test@example.com',
            password: '123' // Too short
        };

        const { statusCode, body } = await supertest(app)
            .post("/api/v1/user/login")
            .send(invalidPasswordRequestBody);

        expect(statusCode).toBe(400);
        expect(body.message).toBe("Password should be between 6 and 12 characters");
    });

    it('should return 400 if the user does not exist', async () => {

        userModel.findOne.mockImplementation(() => ({
            select: jest.fn().mockResolvedValue(null) // Simulate no user found
        }));
    
        const { statusCode, body } = await supertest(app)
            .post("/api/v1/user/login")
            .send(loginRequestBody);
    
        expect(body.message).toBe("User does not exist");
        expect(statusCode).toBe(400);
    });


    it('should return 404 if the password is incorrect', async () => {
        userModel.findOne.mockImplementation(() => ({
            select: jest.fn().mockResolvedValue({
                ...userPayload,
                save: jest.fn().mockResolvedValue(true) // Mocking the save() method for failed login attempts
            })
        })); // Simulate finding the user
        
        userPayload.comparePassword.mockResolvedValue(false); // Simulate incorrect password

        const { statusCode, body } = await supertest(app)
            .post("/api/v1/user/login")
            .send(loginRequestBody);
            
            expect(body.message).toBe("Wrong Password");
            expect(statusCode).toBe(404);  
    });
 
 

    it('should return 500 if there is a server error during login', async () => {
        userModel.findOne.mockImplementation(() => ({
            select: jest.fn().mockRejectedValue(new Error("Database error"))
        }));


        const { statusCode, body } = await supertest(app)
            .post("/api/v1/user/login")
            .send(loginRequestBody);

            expect(body.message).toBe("Database error");
        expect(statusCode).toBe(500);
    });

 
});
