import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import User from "../entities/User";
import config from "../config";

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.authToken;

    if (!token) throw "INVALID_TOKEN";

    const { username }: any = jwt.verify(token, config.JWT_SECRET);

    const user = await User.findOne({ username });

    if (!user) throw "Unauthenticated";

    const response = { username: user.username, email: user.email };

    res.locals.user = response;

    next();
  } catch (error) {
    console.log({ authMiddlewareError: error });

    res.status(401).json({ error });
  }
};
