import asyncHandler from "express-async-handler";
import User from "../model/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import { OAuth2Client } from "google-auth-library";
import { createError } from "../utils/createError.js";
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


export const register = asyncHandler(async (req, res) => {

    const { userName, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        throw createError("User already exists", 409);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
        userName,
        email,
        password: hashedPassword
    });

    const userResponse = newUser.toObject();

    delete userResponse.password;

    return   res.status(201).json({
        success: true,
        message: "Register successfully",
        user: userResponse
    });

});



export const login = asyncHandler(async (req, res) => {

    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
        throw createError("User not found", 404);
    }

    if (!existingUser.password) {
        throw createError(
            "This account uses Google sign-in. Please log in with Google.",
            401
        );
    }

    const isMatch = await bcrypt.compare(
        password,
        existingUser.password
    );

    if (!isMatch) {
        throw createError(
            "Invalid email or password",
            401
        );
    }

    const token = jwt.sign(
        { userId: existingUser._id },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );

    const userResponse = existingUser.toObject();
    delete userResponse.password;

    res.status(200).json({
        user: userResponse,
        token
    });

});



    export const googleLogin  = asyncHandler(async(req,res)=>{
        
            const  {idToken} = req.body


            const ticket = await client.verifyIdToken({
                idToken,
                audience: process.env.GOOGLE_CLIENT_ID
                
            })

            const payload = ticket.getPayload()

            let user = await User.findOne({email:payload.email.toLocaleLowerCase()})
            if(!user){
                user = await User.create({
                    userName: payload.name,
                    email: payload.email.toLowerCase(),
                    googleId: payload.sub,
                })
            }

            const token = await jwt.sign({userId:user._id},process.env.JWT_SECRET , {expiresIn:"7d"})
            
            const userResponse = user.toObject()
            delete userResponse.password

            res.status(200).json({user:userResponse , token})
    
        })   