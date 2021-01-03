import { Request, Response, Router } from "express";
import Comment from "../entities/Comment";
import Post from "../entities/Post";
import Sub from "../entities/Sub";

import auth from "../middleware/auth";
import userAuth from "../middleware/user";

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
    const posts = await Post.find({
      order: { created_at: "DESC" },
      relations: ["comments", "votes", "sub"],
    });

    console.log({ res: res.locals.user });
    if (res.locals.user) {
      posts.forEach(p => p.setUserVote(res.locals.user));
    }

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
        relations: ["sub", "votes", "comments"],
      }
    );

    if (res.locals.user) {
      post.setUserVote(res.locals.user);
    }

    res.json({ data: post });
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

async function getPostComments(req: Request, res: Response) {
  const { identifier, slug } = req.params;

  try {
    const post = await Post.findOneOrFail({ identifier, slug });

    const comments = await Comment.find({
      where: { post },
      order: { created_at: "DESC" },
      relations: ["votes"],
    });

    if (res.locals.user) {
      comments.forEach(c => c.setUserVote(res.locals.user));
    }

    res.json({ data: comments });
  } catch (error) {
    console.log({ getPostCommentError: error });

    res.status(400).json({ error: "Something went wrong" });
  }
}

const router = Router();

router.post("/", userAuth, auth, createPost);
router.get("/", userAuth, getPosts);
router.get("/:identifier/:slug", userAuth, getPost);
router.post("/:identifier/:slug/comments", userAuth, auth, commentOnPost);
router.get("/:identifier/:slug/comments", userAuth, getPostComments);

export default router;
