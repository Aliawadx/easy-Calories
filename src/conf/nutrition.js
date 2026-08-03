import dotenv from "dotenv";

dotenv.config({ quiet: true });

const SEARCH_URL = "https://api.nal.usda.gov/fdc/v1/foods/search";

// "Survey (FNDDS)" represents food as typically consumed (best fit for logging
// a meal). Prefer it, then whole-ingredient reference data, then branded products last
// — a plain-text search for e.g. "banana" otherwise tends to surface a branded
// snack product before the plain fruit.
const DATA_TYPE_PRIORITY = ["Survey (FNDDS)", "Foundation", "SR Legacy", "Branded"];

function dataTypePriority(dataType) {
    const index = DATA_TYPE_PRIORITY.indexOf(dataType);
    return index === -1 ? DATA_TYPE_PRIORITY.length : index;
}

function findEnergyKcalPer100g(foodNutrients) {
    if (!Array.isArray(foodNutrients)) return null;

    const match = foodNutrients.find((n) => {
        const name = n.nutrientName || n.nutrient?.name || "";
        const unit = (n.unitName || n.nutrient?.unitName || "").toUpperCase();
        return name.toLowerCase().includes("energy") && unit === "KCAL";
    });

    const value = match?.value ?? match?.amount;
    return typeof value === "number" ? value : null;
}

/**
 * Looks up real calorie data for a food + portion via USDA FoodData Central.
 * Returns null (not a thrown error) when no usable match is found,
 * so callers can fall back to the AI's own estimate.
 */
export async function lookupCalories(foodName, portionGrams) {
    const params = new URLSearchParams({
        api_key: process.env.USDA_API_KEY,
        query: foodName,
        pageSize: "10",
    });

    const response = await fetch(`${SEARCH_URL}?${params}`);
    if (!response.ok) {
        return null;
    }

    const data = await response.json();
    const foods = [...(data.foods || [])].sort(
        (a, b) => dataTypePriority(a.dataType) - dataTypePriority(b.dataType)
    );

    for (const food of foods) {
        const kcalPer100g = findEnergyKcalPer100g(food.foodNutrients);
        if (kcalPer100g !== null) {
            return Math.round((kcalPer100g / 100) * portionGrams);
        }
    }

    return null;
}
