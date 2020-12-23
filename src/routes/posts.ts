import { Request, Response, Router } from "express";
import Post from "../entities/Post";
import Sub from "../entities/Sub";

import auth from "../middleware/auth";

async function createPost(req: Request, res: Response) {
  const { title, body, sub } = req.body;

  const user = res.locals.user;

  if (!title.trim()) throw new Error("Title is required");

  try {
    const subRecord = await Sub.findOneOrFail({ name: sub });

    const post = new Post({ title, body, user, sub: subRecord });
    await post.save();

    res.json(post);
  } catch (error) {
    console.log({ createPostError: error });

    res.status(500).json({ error: "Something went wrong" });
  }
}

const router = Router();

router.post("/", auth, createPost);

export default router;
