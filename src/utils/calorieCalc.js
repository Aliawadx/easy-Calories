const ACTIVITY_MULTIPLIERS = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
}

const GOAL_OFFSETS = {
    lose: -500,
    maintain: 0,
    gain: 500,
}

export function calculateDailyTarget({ gender, age, heightCm, weightKg, activityLevel, goal }) {
    const bmr = gender === "male"
        ? 10 * weightKg + 6.25 * heightCm - 5 * age + 5
        : 10 * weightKg + 6.25 * heightCm - 5 * age - 161

    const tdee = bmr * ACTIVITY_MULTIPLIERS[activityLevel]

    return Math.round(tdee + GOAL_OFFSETS[goal])
}
