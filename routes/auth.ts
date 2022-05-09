import express, { Request, Response } from "express";
const router = express.Router();
// import {User, Session} from "../models/user";
const { User, Session } = require("../models/user");
import bcrypt from "bcrypt";

router.get("/", async (req: Request, res: Response) => {
  return res.json({ message: "hello world" });
});

router.post("/register", async (req: Request, res: Response) => {
  const newUser = new User(req.body.userData);
  try {
    const newSessionId = new Session();
    newUser.sessions.push(newSessionId);
    const savedUser = await newUser.save();
    console.log("User added successfully...");
    return res
      .status(201)
      .json({
        user: savedUser,
        _id: savedUser._id,
        sessionId: newSessionId.sessionId,
      });
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
      async (err, result) => {
        if (result != true) {
          return res
            .status(404)
            .json({ message: "Incorrect username or password" });
        } else {
          const newSessionId = new Session();
          user.sessions.push(newSessionId);
          await user.save();
          return res.status(200).json({
            message: "Logged in",
            _id: user._id,
            sessionId: newSessionId.sessionId,
          });
        }
      }
    );
  } catch (err: any) {
    return res.status(404).json({ message: "Incorrect username or password" });
  }
});

router.post("/verifylogin", async (req: Request, res: Response) => {
  try {
    let isCorrect = false;
    const user = await User.findById(req.body?.userData?._id);
    user.sessions.forEach((e: typeof Session) => {
      if (req.body?.userData?.sessionId == e.sessionId) {
        isCorrect = true;
        return res.status(200).json({ message: "Correct session ID" });
      }
    });
    if (!isCorrect)
      return res.status(400).json({ message: "Incorrect session ID" });
  } catch (err: any) {
    return res.status(500).json({ message: err });
  }
});

export default router;
