import express, { Request, Response } from "express";
const router = express.Router();
import User from "../models/user";
import bcrypt from "bcrypt";

router.get("/", async (req: Request, res: Response) => {
  return res.json({ message: "hello world" });
});

router.post("/register", async (req: Request, res: Response) => {
  if (req.body === null)
    return res.status(400).json({ message: "Invalid input" });
  const newUser = new User(req.body.userData);

  try {
    const savedUser = await newUser.save();
    console.log("User added successfully...");
    return res.status(201).json(savedUser);
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
});

router.post("/login", async (req: Request, res: Response) => {
  if (req.body.userData === undefined || req.body.userData.username === undefined)
    return res.status(400).json({ message: "Invalid input" });

  let user;
  try {
    user = await User.find({ username: req.body.userData.username });
    if (user.length === 0)
      return res.status(404).json({ message: "Username is not registered" });
    return res.status(200).json(user);
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
});

export default router;
