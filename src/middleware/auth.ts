import { NextFunction, Request, Response } from "express";

import User from "../entities/User";

export default async (_: Request, res: Response, next: NextFunction) => {
  try {
    const user: User | undefined = res.locals.user;

    if (!user) throw "Unauthenticated";

    next();
  } catch (error) {
    console.log({ authMiddlewareError: error });

    res.status(401).json({ error });
  }
};
