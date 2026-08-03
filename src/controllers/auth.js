
import User from "../model/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import { OAuth2Client } from "google-auth-library";
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


export const register = async(req,res)=>{
    const {userName , password , email} =req.body
    try {
        
        if(!email || typeof email !=="string" || !email.trim()){
            return res.status(400).json({success:false , message:"email is requierd"})
        }
        if(!password || typeof password !=="string" || !password.trim()){
            return res.status(400).json({success:false , message:"password is requierd"})
        }
        if(!userName || typeof userName !== "string" || !userName.trim()){
            return res.status(400).json({success:false , message:"User name is requierd"})
        }
        
        const existingUser = await User.findOne({email:email.trim()})
        if(existingUser){
            return res.status(400).json({message:"Usee already exist"})
        }
        
        const hashedPassword = await bcrypt.hash(password,10)
        
        const newUser = await User.create({
            userName : userName.trim(),
            email:email.trim().toLowerCase(),
            password:hashedPassword
        })
        

        const userResponse = newUser.toObject()
        delete userResponse.password

        res.status(201).json({
            success:true,
            message:"register successfully",
            user:userResponse
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"server error"})
    }
    }




    export const login = async(req,res)=>{
        try {
            const {email,password} = req.body
            if(!email.trim()|| typeof email!== "string" || !password.trim()|| typeof password !== "string"){
            return res.status(400).json({message:"Email and password are requierd"})
            }
            
            const existingUser = await User.findOne({email:email.trim().toLowerCase()})
            if(!existingUser){
                return res.status(400).json({message:"User not found"})
            }

            if (!existingUser.password) {
            return res.status(400).json({ message: "This account uses Google sign-in. Please log in with Google." })}
            
            const ismatch = await bcrypt.compare(password,existingUser.password)
            if(!ismatch){
                return res.status(400).json({message:"Email or password is not valid"})
            }

            const token = jwt.sign({userId: existingUser._id} , process.env.JWT_SECRET , {expiresIn:"7d"})
            const userResponse = existingUser.toObject()
            delete userResponse.password

        res.status(200).json({user:userResponse , token})
        } catch (error) {
            console.log(error)
            return res.status(500).json({message:"server error"})
        }
    }




    export const googleLogin  = async(req,res)=>{
        try {
            const  {idToken} = req.body
            if(!idToken){
                return res.status(400).json({message:"Id toke is requierd"})
            }

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
        } catch (error) {
            return res.status(401).json({ message: "Invalid Google token" });
        }

    }    