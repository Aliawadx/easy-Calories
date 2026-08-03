import Meal from "../model/Meal.js";
import fs from "fs"
import { identifyFood } from "../conf/gemini.js";
import { lookupCalories } from "../conf/nutrition.js";

async function resolveMeal(req, source) {
    const buffer = fs.readFileSync(req.file.path)
    const { foodName, portionGrams, fallbackCalories } = await identifyFood(buffer, req.file.mimetype)

    const realCalories = await lookupCalories(foodName, portionGrams)
    const calories = realCalories !== null ? realCalories : fallbackCalories

    return Meal.create({
        userId: req.user._id,
        source,
        foodName,
        calories,
    })
}

export const photoMeal  = async(req,res)=>{
    try {
        const meal = await resolveMeal(req, "photo")

        fs.unlink(req.file.path ,()=>{})

        res.status(201).json(meal)
    } catch (error) {
        console.log(error)
        if (req.file) fs.unlink(req.file.path, () => {})
        return res.status(500).json({message:"server error"})
    }
}
export const voicetoMeal  = async(req,res)=>{
    try {
        const meal = await resolveMeal(req, "voice")

        fs.unlink(req.file.path ,()=>{})

        res.status(201).json(meal)
    } catch (error) {
        console.log(error)
        if (req.file) fs.unlink(req.file.path, () => {})
        return res.status(500).json({message:"server error"})
    }
}



export const getDailySummary  = async(req,res)=>{
    try {
        const dateParam = req.query.date ? new Date(req.query.date) :new Date()
        const startOfDay = new Date(dateParam)
        startOfDay.setHours(0,0,0,0)

        const endOfDay = new Date(dateParam)
        endOfDay.setHours(23, 59, 59, 999)

        const meals = await Meal.find({
            userId:req.user._id,
            createdAt:{ $gte: startOfDay, $lte: endOfDay }

        }).sort({ createdAt: 1 })


        const totalCalories = meals.reduce((sum,meals)=> sum+ meals.calories,0)
        const target = req.user.dailyCalorieTarget
        const remaining = Math.max(0, target  - totalCalories)
        const exceededBy= Math.max(0, totalCalories - target )

        res.status(200).json({
    meals,
    totalCalories,
    target,
    remaining: Math.max(0, target  - totalCalories),
    exceededBy: Math.max(0, totalCalories - target )
})
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "server error" })
    }
}




export const deleteMeal = async(req,res)=>{
    try {
        const mealId = req.params.id
        if(!mealId){
            return res.status(400).json({message:"meal Id is requierd"})
        }

        const meal = await Meal.findOneAndDelete({ _id: mealId, userId: req.user._id })

        if(!meal){
            return res.status(404).json({message:"meal not found"})
        }

        res.status(200).json({message:"meal deleted successfully"})
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"server error"})
    }
}