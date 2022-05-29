import express, { Request, Response } from "express";
const router = express.Router();
import Post from "../models/post";
import mongoose, { Schema } from "mongoose";
import { User as UserType } from "../models/user";

interface PostType {
  _id?: string;
  title: string;
  content: string;
  creationDate?: Date;
  creator: UserType | Schema.Types.ObjectId;
}

const compare = (a: PostType | any, b: PostType | any): number => {
  if (a.creationDate >= b.creationDate) {
    return -1;
  } else {
    return 1;
  }
};

router.get("/allposts", async (req: Request, res: Response) => {
  try {
    const posts = await Post.find().populate("creator");
    if (posts.length < 1)
      return res.status(400).json({ message: "No posts found" });
    posts.sort(compare);
    return res.status(200).json(posts);
  } catch (err: any) {
    return res.status(500).json({ message: err });
  }
});

router.get("/limit/:start/:count", async (req: Request, res: Response) => {
  try {
    const posts = await Post.find().populate("creator");
    if (posts.length < 1)
      return res.status(404).json({ message: "No posts found" });
    const end = Number(req.params.start) + Number(req.params.count);
    let limitedPosts = [];
    posts.sort(compare);
    for (let i = Number(req.params.start); i < end; i++) {
      limitedPosts.push(posts[i]);
    }
    return res.status(200).json(limitedPosts);
  } catch (err: any) {
    return res.status(500).json({ message: err });
  }
});

router.get("/postid/:id", async (req: Request, res: Response) => {
  try {
    const post = await Post.findById(req.params.id).populate("creator");
    return res.status(200).json(post);
  } catch (err: any) {
    return res.status(500).json({ message: err });
  }
});

router.get("/latest/:id", async (req: Request, res: Response) => {
  try {
    const lastPost = await Post.findById(req.params.id);
    const posts = await Post.find({
      creationDate: { $gte: lastPost.creationDate },
    }).populate("creator");
    if (posts.length < 2)
      return res.status(200).json({ message: "Already on latest" });
    posts.sort(compare);
    posts.pop();
    return res.status(200).json(posts);
  } catch (err: any) {
    return res.status(400).json({ message: err });
  }
});

router.post("/newpost", async (req: Request, res: Response) => {
  const post = new Post({
    title: req.body?.postData?.title,
    content: req.body?.postData?.content,
    creator: new mongoose.Types.ObjectId(req.body?.postData?.creator),
  });
  try {
    await post.save();
    console.log("Post added successfully...");
    const resPost = await Post.findById(post._id).populate("creator");
    return res.status(201).json(resPost);
  } catch (err: any) {
    return res.status(400).json({ message: err });
  }
});

export default router;
