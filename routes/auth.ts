import express, { Request, Response } from "express";
const router = express.Router();
import User from "../models/user";
import bcrypt from "bcrypt";
import { saltRounds } from "../models/user";

router.get("/", async (req: Request, res: Response) => {
  return res.json({ message: "hello world" });
});

router.post("/register", async (req: Request, res: Response) => {
  if (req.body === null)
    return res.status(400).json({ message: "Invalid input" });

  // TODO: Validate user
  const newUser = new User(req.body.userData);
  try {
    const savedUser = await newUser.save();
    console.log("User added successfully...");
    return res.status(201).json(savedUser);
  } catch (err: any) {
    return res.status(400).json({ message: err.code });
  }
});

router.post("/login", async (req: Request, res: Response) => {
  if (
    req.body.userData === undefined ||
    req.body.userData.username === undefined ||
    req.body.userData.password === undefined
  )
    return res.status(400).json({ message: "Invalid input" });

  // TODO: Validate user
  let user;
  try {
    user = await User.find({ username: req.body.userData.username });
    if (user.length === 0)
      return res
        .status(400)
        .json({ message: "Incorrect password or username" });
    else if (user.length === 1) {
      bcrypt.compare(
        req.body.userData.password,
        user[0].passwordHash,
        (err, result) => {
          if (result != true) {
            return res
              .status(400)
              .json({ message: "Incorrect password or username" });
          } else {
            return res.status(200).json({ message: "Logged in" });
          }
        }
      );
    } else {
      return res.status(500);
    }
  } catch (err: any) {
    return res.status(500).json({ message: err.code });
  }
});

export default router;
