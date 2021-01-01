import { Request, Response, Router } from "express";
import Comment from "../entities/Comment";
import Post from "../entities/Post";
import Sub from "../entities/Sub";

import auth from "../middleware/auth";

async function createPost(req: Request, res: Response) {
  const { title, body, sub } = req.body;

  const user = res.locals.user;

  if (!title.trim()) throw "Title is required";

  try {
    const subRecord = await Sub.findOneOrFail({ name: sub });

    const post = new Post({ title, body, user, sub: subRecord });
    await post.save();

    res.json(post);
  } catch (error) {
    console.log({ createPostError: error });

    res.status(500).json({ error });
  }
}

async function getPosts(_: Request, res: Response) {
  try {
    const posts = await Post.find({ order: { created_at: "DESC" } });

    res.json({ data: posts });
  } catch (error) {
    console.log({ getPostError: error });
    res.status(500).json({ error: "Something went wrong" });
  }
}

async function getPost(req: Request, res: Response) {
  const { identifier, slug } = req.params;

  try {
    const post = await Post.findOneOrFail(
      { identifier, slug },
      {
        relations: ["sub"],
      }
    );

    res.json(post);
  } catch (error) {
    console.log({ getPostError: error });
    res.status(404).json({ error: "Post not found" });
  }
}

async function commentOnPost(req: Request, res: Response) {
  const { identifier, slug } = req.params;
  const { body } = req.body;

  try {
    const post = await Post.findOneOrFail({ identifier, slug });

    const comment = new Comment({ body, user: res.locals.user, post });

    await comment.save();

    res.json(comment);
  } catch (error) {
    console.log({ commentOnPostError: error });

    res.status(400).json({ error: "Post not found" });
  }
}

const router = Router();

router.post("/", auth, createPost);
router.get("/", getPosts);
router.get("/:identifier/:slug", getPost);
router.post("/:identifier/:slug/comments", auth, commentOnPost);

export default router;
