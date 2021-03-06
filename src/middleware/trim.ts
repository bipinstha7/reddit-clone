import { NextFunction, Request, Response } from "express";

export default (req: Request, _: Response, next: NextFunction) => {
  Object.keys(req.body).forEach(key => {
    const exceptions = ["password"];
    if (typeof req.body[key] === "string" && !exceptions.includes(key)) {
      req.body[key] = req.body[key].trim();
    }
  });

  next();
};
