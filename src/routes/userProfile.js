import express from "express";
import { getUserProfile,updateUserProfile } from "../controllers/User.js";
import authMiddleware from "../middlewares/auth.js";
const router = express.Router()


router.get("/getProfile",authMiddleware,getUserProfile)
router.put("/updateProfile",authMiddleware,updateUserProfile)





export default router