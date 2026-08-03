import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    userName:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        trim:true,
        required:true,
        unique:true,
        lowercase:true
    },
    password:{
        type:String,
        trim:true
        
    },
    googleId: {
    type: String
    },
    gender:{
        type:String,
        enum:["male","female"]
    },
    age:{
        type:Number
    },
    heightCm:{
        type:Number
    },
    weightKg:{
        type:Number
    },
    activityLevel:{
        type:String,
        enum:["sedentary","light","moderate","active","very_active"]
    },
    goal:{
        type:String,
        enum:["lose","maintain","gain"]
    },
    dailyCalorieTarget:{
        type:Number,
        default:0
    }
},{timestamps:true})


const User = mongoose.model("User" , userSchema)
export default User