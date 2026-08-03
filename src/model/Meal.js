import mongoose from "mongoose";

const mealSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    source: {
        type: String,
        enum: ["voice", "photo"],
        required: true,
    },
    foodName: {
        type: String,
        required: true,
        trim: true,
    },
    calories: {
        type: Number,
        required: true,
    },
}, { timestamps: true })

const Meal = mongoose.model("Meal", mealSchema)
export default Meal
