import express from "express";
import { photoMeal,voicetoMeal , getDailySummary, deleteMeal } from "../controllers/meal.js";
import authMiddleware from "../middlewares/auth.js";
import upload from "../middlewares/upload.js";

const router = express.Router()


router.post("/photo", authMiddleware, upload.single("file"), photoMeal)
router.post("/voice", authMiddleware, upload.single("file"), voicetoMeal)
router.get("/dailysummary" , authMiddleware , getDailySummary)
router.delete("/:id" , authMiddleware , deleteMeal)
export default router