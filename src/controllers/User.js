import authMiddleware from "../middlewares/auth.js";
import User from "../model/User.js";
import { calculateDailyTarget } from "../utils/calorieCalc.js";






export const getUserProfile = async(req,res)=>{
    try {
        const userId = req.user._id
        const user = await User.findById(userId)
        if(!user){
            return res.status(404).json({message:"user not found"})
        }

        const userResponse = user.toObject()
        delete userResponse.password

        res.status(200).json(userResponse)
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"server error"})
    }
}


export const updateUserProfile = async(req,res)=>{
    try {
        const { gender, age, heightCm, weightKg, activityLevel, goal } = req.body

        const user = await User.findById(req.user._id)
        if(!user){
            return res.status(404).json({message:"user not found"})
        }

        if(gender) user.gender = gender
        if(age) user.age = age
        if(heightCm) user.heightCm = heightCm
        if(weightKg) user.weightKg = weightKg
        if(activityLevel) user.activityLevel = activityLevel
        if(goal) user.goal = goal

        if(user.gender && user.age && user.heightCm && user.weightKg && user.activityLevel && user.goal){
            user.dailyCalorieTarget = calculateDailyTarget({
                gender: user.gender,
                age: user.age,
                heightCm: user.heightCm,
                weightKg: user.weightKg,
                activityLevel: user.activityLevel,
                goal: user.goal,
            })
        }

        await user.save()

        const userResponse = user.toObject()
        delete userResponse.password

        res.status(200).json({
            message:"profile updated successfully",
            user: userResponse
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"server error"})
    }
}


