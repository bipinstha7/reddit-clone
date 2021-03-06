import { Request, Response, Router } from "express";
import { isEmpty, validate } from "class-validator";
import argon2 from "argon2";
import jwt from "jsonwebtoken";

import User from "../entities/User";
import config from "../config";
import cookie from "cookie";
import auth from "../middleware/auth";
import userAuth from "../middleware/user";

async function register(req: Request, res: Response) {
  const { email, username, password } = req.body;

  try {
    /**
     * The new User({...}) called on User.ts constuctor function
     * by which we don't need to use
     * use.email = email; user.name = name
     */
    const user = new User({ email, username, password });
    const errors = await validate(user, { validationError: { target: false } });
    if (errors.length) {
      return res.status(400).json({ errors: mapErrors(errors) });
    }

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

    const hash = await argon2.hash(password);
    user.password = hash;

    await user.save();

    return res.json(user);
  } catch (error) {
    console.log({ registerError: error });

    res.status(500).json({ error });
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

    if (!user) throw "Invalid username or password";

    const passwordMatches = await argon2.verify(user.password, password);

    if (!passwordMatches) throw "Invalid username or password";

    const token = jwt.sign({ username }, config.JWT_SECRET);

    const response = {
      username: user.username,
      email: user.email,
      token,
    };

    res.set(
      "Set-Cookie",
      cookie.serialize("authToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 3600,
        path: "/",
      })
    );

    res.status(200).json({ data: response });
  } catch (error) {
    console.log({ loginError: error });
    res.status(401).json({ error });
  }
}

async function me(_: Request, res: Response) {
  res.json({ data: res.locals.user });
}

async function logout(_: Request, res: Response) {
  res.set(
    "Set-Cookie",
    cookie.serialize("authToken", "", {
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
router.post("/me", userAuth, auth, me);
router.post("/logout", userAuth, auth, logout);

export default router;

function mapErrors(errors: object[]) {
  let mappedErrors: any = {};
  errors.forEach((error: any) => {
    const key = error.property;
    const value = Object.values(error.constraints)[0];
    mappedErrors[key] = value;
  });

  return mappedErrors;
}
