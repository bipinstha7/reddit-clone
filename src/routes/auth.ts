import { Request, Response, Router } from "express";
import { validate } from "class-validator";
import argon2 from "argon2";

import { User } from "../entities/User";

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

      const errors = [];
      if (isEmailExists) {
        errors.push({ Email: "Email already exists" });
      }
      if (isUsernameExists) {
        errors.push({ Username: "Username already exists" });
      }

      if (errors.length) throw errors;
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

    delete user.password;

    return res.json(user);
  } catch (error) {
    console.log({ registerError: error });
    const err =
      process.env.NODE_ENV !== "production" ? error : "Something went wrong";
    res.status(500).json({ err });
  }
}

const router = Router();

router.post("/register", register);

export default router;
