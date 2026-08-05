import express from "express";
import { register,login ,googleLogin} from "../controllers/auth.js";
import { loginSchema,registerSchema } from "../Validators/auth.validator.js";
import {validate} from "../middlewares/validators.js";
const router = express.Router()

router.post("/register",validate(registerSchema) , register)
router.post("/login" ,validate(loginSchema) ,login)
router.post("/google", googleLogin)





export default router