import { Request, Response, Router } from "express";
import { isEmpty } from "class-validator";
import { getRepository } from "typeorm";

import auth from "../middleware/auth";
import Sub from "../entities/Sub";

async function createSub(req: Request, res: Response) {
  const { name, title, description } = req.body;

  const user = res.locals.user;

  try {
    let errors: any = {};

    if (isEmpty(name)) errors.name = "Name is required";
    if (isEmpty(title)) errors.title = "Title is required";

    if (Object.keys(errors).length) throw errors;

    const subExists = await getRepository(Sub)
      .createQueryBuilder("sub")
      .where("lower(sub.name)=:name", { name: name.toLowerCase() })
      .getOne();

    if (subExists) errors.name = "Sub already exists";

    if (Object.keys(errors).length) throw errors;

    const sub = new Sub({ name, title, description, user });
    await sub.save();

    res.json(sub);
  } catch (error) {
    console.log({ createSubError: error });

    res.status(500).json({ error });
  }
}

const router = Router();

router.post("/", auth, createSub);

export default router;
