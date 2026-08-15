import express from "express";
import dotenv from "dotenv"
import cors from "cors";
import connectDB from "./conf/DB.js";
import authRouter from"./routes/auth.js"
import profileRouter from "./routes/userProfile.js";
import mealRouter from "./routes/meals.js";
import postRouter from "./routes/post.js";
import { errorHandler } from "./middlewares/errorHandler.js";
dotenv.config({ quiet: true })
const app = express()
app.use(cors())
app.use(express.json())

connectDB()


app.use("/api",authRouter)
app.use("/api",profileRouter)
app.use("/api",mealRouter)
app.use("/api",postRouter)







app.use(errorHandler)


const port = process.env.PORT

app.use((err, req, res, next) => {
    console.log(err)
    res.status(400).json({ message: err.message })
})

app.listen(port, () => {
    console.log(`server is running on http://localhost:${port}`)
})
