import Post from "../model/Post.js";
import Comment from "../model/Comment.js";
import cloudinary from "../conf/cloudinary.js";
import fs from "fs";



export const createPost = async(req,res)=>{
    try {
        if(!req.file){
            return res.status(400).json({ message: "Image is required" })
        }
        const result = await cloudinary.uploader.upload(req.file.path,{
            resource_type:"image",
            folder:"nutritrack/posts"
        })
        fs.unlink(req.file.path, ()=>{})

        const post  = await Post.create({
            userId:req.user._id,
            imageUrl:result.secure_url,
            caption:req.body.caption || ""
        })
        res.status(201).json(post)
    } catch (error) {
        console.log(error)
        if (req.file) fs.unlink(req.file.path, () => {})
        return res.status(500).json({ message: "server error" })
        
    }
}


export const getPost = async(req,res)=>{
    try {
        const posts = await Post.find().populate("userId" ,"userName").sort({ createdAt: -1 })
        res.status(201).json(posts)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "server error" })
    }
}




export  const toggleLike  = async(req,res)=>{
    try {
        const post = await Post.findById(req.params.id)
        if(!post){
            return res.status(404).json({message:"post not found"})
        }

        const alradyLike = post.likes.includes(req.user._id)
        if(alradyLike){
            post.likes.pull(req.user._id)
        }else{
        post.likes.push(req.user._id)
        }
        await post.save()
        res.status(200).json({likesCound:post.likes.length , liked:!alradyLike})
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "server error" })
    }
}







export const aadComment  =async(req,res)=>{
    try {
        const {text} = req.body
        if(!text || !text.trim()){
            return res.status(400).json({message:"Comment text is requierd"})
        }

        const post = await Post.findById(req.params.id)
        if(!post){
            return res.status(404).json({message:"Post not found"})
        }

        const comment = await Comment.create({
            postId: post._id,
            userId: req.user._id,
            text: text.trim(),
        })
        res.status(200).json(comment)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "server error" })
    }
    }


export const getComment  = async(req,res)=>{
    try {
        const comments = await Comment.find({ postId: req.params.id })
            .populate("userId", "userName")
            .sort({ createdAt: 1 })

        res.status(200).json(comments)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "server error" })
    }
}

