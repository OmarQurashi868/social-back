import express, { Request, Response } from "express";
const router = express.Router();
import Post from "../models/post";

router.get("/allposts", async (req: Request, res: Response) => {
  try {
    const posts = await Post.find();
    if (posts.length < 1)
      return res.status(400).json({ message: "No posts found" });
    return res.status(200).json(posts);
  } catch (err: any) {
    return res.status(500).json({ message: err });
  }
});

router.get("/postid/:id", async (req: Request, res: Response) => {
  try {
    const post = await Post.findById(req.params.id);
    return res.status(200).json(post);
  } catch (err: any) {
    return res.status(500).json({ message: err });
  }
});

router.post("/newpost", async (req: Request, res: Response) => {
  const newpost = new Post(req.body.postData);
  try {
    const savedPost = await newpost.save();
    console.log("Post added successfully...");
    return res.status(201).json(savedPost);
  } catch (err: any) {
    return res.status(500).json({ message: err });
  }
});

export default router;
