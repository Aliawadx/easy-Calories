import express from "express";
import {
    createPost,
    getPost,
    toggleLike,
    aadComment,
    getComment,
} from "../controllers/post.js";
import authMiddleware from "../middlewares/auth.js";
import upload from "../middlewares/upload.js";

const router = express.Router()

router.post("/", authMiddleware, upload.single("file"), createPost)
router.get("/", authMiddleware, getPost)
router.post("/:id/like", authMiddleware, toggleLike)
router.post("/:id/comments", authMiddleware, aadComment)
router.get("/:id/comments", authMiddleware, getComment)

export default router