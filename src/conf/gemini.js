import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config({ quiet: true });

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const PROMPT = `You are a nutrition assistant. Identify the food in this input (image or audio description of a meal) and estimate its portion size in grams.
Respond with ONLY raw JSON, no markdown, no code fences, in exactly this shape:
{"foodName": "string", "portionGrams": number, "fallbackCalories": number}
"foodName" should be a short, common food name suitable for looking up in a nutrition database (e.g. "grilled chicken breast", not "delicious chicken").
"fallbackCalories" is your own rough calorie estimate for this portion, used only if a nutrition database lookup fails.
If you cannot identify any food, respond with {"foodName": "unknown", "portionGrams": 0, "fallbackCalories": 0}.`;

function extractJson(text) {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("Gemini did not return JSON");
    return JSON.parse(match[0]);
}

export async function identifyFood(fileBuffer, mimeType) {
    const type = mimeType.startsWith("audio/") ? "audio" : "image";

    const interaction = await ai.interactions.create({
        model: "gemini-3.6-flash",
        input: [
            { type: "text", text: PROMPT },
            {
                type,
                data: fileBuffer.toString("base64"),
                mime_type: mimeType,
            },
        ],
    });

    const text = interaction.output_text;
    const parsed = extractJson(text);

    if (typeof parsed.foodName !== "string" || typeof parsed.portionGrams !== "number" || typeof parsed.fallbackCalories !== "number") {
        throw new Error("Gemini returned an unexpected shape");
    }

    return parsed;
}
