import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import validator from "validator"



const userSchema = new mongoose.Schema({
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: [true, "This email is aleady registerd"],
        required: [true, "Email address is required"],
        validate: [validator.isEmail, "Please enter a valid email format"]

    },
    password: {
        type: String,
        required: true,
        select: false,
        minLength: [6, "Password should be at least 6 characters"],
        maxLength: [12, "Password should be at most 12 characters"],
    }
})

// converting password into hash
userSchema.pre("save", async function () {
    if (!this.isModified('password')) {
        next()
    }
    this.password = await bcrypt.hash(this.password, 10)
})

// compairing password
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

//josn web token genrator
userSchema.methods.getJWTtoken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECREATE, {
        expiresIn: process.env.JWT_EXPIRE
    })
}

const userModel = mongoose.model('user', userSchema)
export default userModel;
