import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../model/User.js";



async function authMiddleware(req,res,next) {

const authHeader = req.headers.authorization
if(!authHeader ||  !authHeader.startsWith('Bearer')){
    return res.status(400).json({message:"unauthorized"})
}

const token = authHeader.split(" ")[1]

try {
    const decoded = jwt.verify(token,process.env.JWT_SECRET)

    const user = await User.findById(decoded.userId)
    if(!user){
        return res.status(404).json({message:"user not found"})
    }
    req.user = user
    next()
} catch (error) {
        console.log(error)
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        })
}
}
export default authMiddleware