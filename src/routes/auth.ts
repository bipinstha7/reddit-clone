import { Request, Response, Router } from "express";
import { isEmpty, validate } from "class-validator";
import argon2 from "argon2";
import jwt from "jsonwebtoken";

import User from "../entities/User";
import config from "../config";
import cookie from "cookie";
import auth from "../middleware/auth";

async function register(req: Request, res: Response) {
  const { email, username, password } = req.body;

  try {
    const checkEmail = User.findOne({ email });
    const checkUsername = User.findOne({ username });
    try {
      const [isEmailExists, isUsernameExists] = await Promise.all([
        checkEmail,
        checkUsername,
      ]);

      const errors: any = {};
      if (isEmailExists) {
        errors.email = "Email already exists";
      }
      if (isUsernameExists) {
        errors.username = "Username already exists";
      }

      if (Object.keys(errors).length) throw errors;
    } catch (error) {
      console.log({ registerPromiseAllError: error });
      throw error;
    }

    /**
     * The new User({...}) called on User.ts constuctor function
     * by which we don't need to use
     * use.email = email; user.name = name
     */
    const user = new User({ email, username, password });
    const errors = await validate(user, { validationError: { target: false } });
    if (errors.length) return res.status(400).json({ errors });

    const hash = await argon2.hash(password);
    user.password = hash;

    await user.save();

    return res.json(user);
  } catch (error) {
    console.log({ registerError: error });
    const err =
      process.env.NODE_ENV !== "production" ? error : "Something went wrong";
    res.status(500).json({ err });
  }
}

async function login(req: Request, res: Response) {
  const { username, password } = req.body;

  try {
    let errors: any = {};

    if (isEmpty(username)) errors.username = "Username is required";
    if (isEmpty(password)) errors.password = "Password is required";

    if (Object.keys(errors).length) throw errors;

    const user = await User.findOne({ username });

    if (!user) throw new Error("Invalid username or password");

    const passwordMatches = await argon2.verify(user.password, password);

    if (!passwordMatches) throw new Error("Invalid username or password");

    const token = jwt.sign({ username }, config.JWT_SECRET);

    const response = {
      username: user.username,
      email: user.email,
      token,
    };

    res.set(
      "Set-Cookie",
      cookie.serialize("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 3600,
        path: "/",
      })
    );

    res.status(200).json({ user: response });
  } catch (error) {
    console.log({ loginError: error });
    res.status(401).json({ error });
  }
}

async function me(_: Request, res: Response) {
  res.json({ user: res.locals.user });
}

async function logout(_: Request, res: Response) {
  res.set(
    "Set-Cookie",
    cookie.serialize("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      expires: new Date(0),
      path: "/",
    })
  );

  res.status(200).json({ success: true });
}

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/me", auth, me);
router.post("/logout", auth, logout);

export default router;
