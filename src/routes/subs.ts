import { Request, Response, Router } from "express";
import { isEmpty } from "class-validator";
import { getRepository } from "typeorm";

import auth from "../middleware/auth";
import userAuth from "../middleware/user";
import Sub from "../entities/Sub";
import Post from "../entities/Post";

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

async function getSub(req: Request, res: Response) {
  const { name } = req.params;

  try {
    const sub = await Sub.findOneOrFail({ name });
    const posts = await Post.find({
      where: { sub },
      order: { created_at: "DESC" },
      relations: ["comments", "votes"],
    });

    sub.posts = posts;

    if (res.locals.user) {
      sub.posts.forEach(p => p.setUserVote(res.locals.user));
    }

    res.json({ data: sub });
  } catch (error) {
    console.log({ getSubError: error });

    res.status(404).json({ error: "sub not found" });
  }
}

const router = Router();

router.post("/", userAuth, auth, createSub);
router.get("/:name", userAuth, getSub);

export default router;
