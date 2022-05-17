import express, { Request, Response } from "express";
const router = express.Router();
import User from "../models/user"
import Session from "../models/session"
import bcrypt from "bcrypt";

router.get("/", async (req: Request, res: Response) => {
  return res.json({ message: "hello world" });
});

router.post("/register", async (req: Request, res: Response) => {
  const newUser = new User(req.body.userData);
  try {
    const newSession = new Session({userId: newUser._id});
    await newUser.save();
    await newSession.save();
    console.log("User added successfully...");
    return res.status(201).json({
      user: newUser,
      sessionId: newSession._id,
    });
  } catch (err: any) {
    return res.status(500).json({ message: err });
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
            .status(401)
            .json({ message: "Incorrect username or password" });
        } else {
          const newSession = new Session({userId: user._id});
          await user.save();
          await newSession.save();
          return res.status(200).json({
            message: "Logged in",
            _id: user._id,
            sessionId: newSession._id,
          });
        }
      }
    );
  } catch (err: any) {
    return res.status(401).json({ message: "Incorrect username or password" });
  }
});

router.post("/verifylogin", async (req: Request, res: Response) => {
  try {
    let isCorrect = false;
    const sessions = await Session.find({userId: req.body?.userData?._id});
    sessions.forEach((e) => {
      if (req.body?.userData?.sessionId == e._id) {
        isCorrect = true;
        e.creationDate = new Date();
        e.save()
        return res.status(200).json({ message: "Correct session ID" });
      }
    });
    if (!isCorrect)
      return res.status(401).json({ message: "Incorrect session ID" });
  } catch (err: any) {
    return res.status(500).json({ message: err });
  }
});

router.post("/removesession", async (req: Request, res: Response) => {
  try {
    const sessions = await Session.find({userId: req.body?.userData?._id});
    sessions.forEach(async (e, i: number) => {
      if (req.body?.userData?.sessionId == e._id) {
        await e.delete();
      }
    });
    return res.status(200).json({ message: "Removed session" });
  } catch (err: any) {
    return res.status(500).json({ message: err });
  }
});

router.post("/getuserinfo", async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.body?.userData?._id);
    return res.status(200).json({ userData: user });
  } catch (err: any) {
    return res.status(500).json({ message: err });
  }
});

export default router;
