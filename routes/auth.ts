import express, { Request, Response } from "express";
const router = express.Router();
import User from "../models/user";
import bcrypt from "bcrypt";

router.get("/", async (req: Request, res: Response) => {
  return res.json({ message: "hello world" });
});

router.post("/register", async (req: Request, res: Response) => {
  const newUser = new User(req.body.userData);
  try {
    const savedUser = await newUser.save();
    console.log("User added successfully...");
    return res.status(201).json(savedUser);
  } catch (err: any) {
    return res.status(400).json({ message: err });
  }
});

router.post("/login", async (req: Request, res: Response) => {
  if (
    req.body?.userData?.username === undefined ||
    req.body?.userData?.password === undefined ||
    req.body?.userData?.username.length < 1 ||
    req.body?.userData?.password.length < 1
  )
    return res.status(400).json({ message: "Fields cannot be left empty" });

  try {
    const user = await User.findOne({
      username: req.body.userData.username,
    }).select("+password");

    bcrypt.compare(
      req.body.userData.password,
      user.password,
      (err, result) => {
        if (result != true) {
          return res
            .status(404)
            .json({ message: "Incorrect username or password" });
        } else {
          return res.status(200).json({ message: "Logged in" });
        }
      }
    );
  } catch (err: any) {
    return res.status(404).json({ message: "Incorrect username or password" });
  }
});

export default router;
