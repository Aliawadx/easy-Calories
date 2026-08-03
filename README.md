# EasyCal (NutriTrack) — API

A REST API for a calorie-tracking app. Users set up body stats and a goal to get a daily calorie target, then log meals by **photo or voice** — an AI identifies the food and a nutrition database prices the exact calories, so there's no manual food search or entry. It also has a small social feed for sharing recipes.

## Features

- **Auth** — email/password (JWT) and Google Sign-In
- **Body stats & calorie target** — height, weight, age, gender, activity level and goal feed a Mifflin-St Jeor calculation for a daily calorie target
- **AI meal logging** — upload a food photo or a voice note; Gemini identifies the food and portion, then USDA FoodData Central prices the real calories (falls back to Gemini's own estimate if no match is found)
- **Daily summary** — total consumed, target, and remaining/exceeded for any day
- **Recipe feed** — post a meal photo with a caption, like and comment on others' posts

## Tech stack

- Node.js + Express (ES modules)
- MongoDB + Mongoose
- JWT + bcryptjs, `google-auth-library` for Google Sign-In
- Multer for uploads, Cloudinary for permanent image storage (recipe posts)
- `@google/genai` (Gemini) for food recognition, USDA FoodData Central API for calorie data

## Project structure

```
src/
├── index.js               # app entry, middleware, route mounting
├── conf/
│   ├── DB.js                # MongoDB connection
│   ├── cloudinary.js        # Cloudinary config (recipe post images)
│   ├── gemini.js            # Gemini client — identifies food from a photo/voice note
│   └── nutrition.js         # USDA FoodData Central lookup — real calories for a food + portion
├── model/                 # Mongoose schemas (User, Meal, Post, Comment)
├── controllers/           # route handlers
├── routes/                # Express routers
└── middlewares/
    ├── auth.js              # JWT auth guard
    └── upload.js            # Multer disk storage + file type filters
```

## API

All routes are mounted on `/api`. All routes except register/login/google require `Authorization: Bearer <token>`.

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/register` | Create an account |
| POST | `/api/login` | Log in, returns a JWT |
| POST | `/api/google` | Sign in with a Google ID token |
| GET | `/api/getProfile` | Get body stats + daily calorie target |
| PUT | `/api/updateProfile` | Set/update body stats (recalculates the target) |
| POST | `/api/photo` | Log a meal from a photo |
| POST | `/api/voice` | Log a meal from a voice note |
| GET | `/api/dailysummary` | Meals + totals for a day (`?date=YYYY-MM-DD`, defaults to today) |
| DELETE | `/api/:id` | Delete a logged meal |
| GET | `/api/` | Recipe feed (all posts) |
| POST | `/api/` | Create a recipe post (photo + caption) |
| POST | `/api/:id/like` | Toggle a like on a post |
| GET | `/api/:id/comments` | Comments on a post |
| POST | `/api/:id/comments` | Add a comment |

## Setup

```bash
npm install
```

Create a `.env` file (see `.env.example`):

```
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=3000
GEMINI_API_KEY=your_gemini_api_key
USDA_API_KEY=your_usda_fooddata_central_api_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
GOOGLE_CLIENT_ID=your_google_oauth_client_id
```

```bash
npm run dev
```
