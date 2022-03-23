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
    res.status(201).json(savedUser);
    console.log("User added successfully...");
  } catch (err: any) {
    res.status(401).json({ message: err.message });
  }
});

export default router;
