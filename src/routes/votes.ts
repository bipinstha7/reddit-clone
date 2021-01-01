import { Request, Response, Router } from "express";
import User from "../entities/User";
import Post from "../entities/Post";
import auth from "../middleware/auth";
import Comment from "../entities/Comment";
import Vote from "../entities/Vote";

async function vote(req: Request, res: Response) {
  const { identifier, slug, commentIdentifier, value } = req.body;

  // validate vote value
  if (![-1, 0, 1].includes(value)) {
    return res.status(400).json({ value: "Value must be -1, o or 1" });
  }

  try {
    const user: User = res.locals.user;

    let post = await Post.findOneOrFail({ identifier, slug });
    let vote: Vote | undefined;
    let comment: Comment | undefined;

    if (commentIdentifier) {
      // If there is a comment identifier, find vote by comment

      comment = await Comment.findOneOrFail({ identifier: commentIdentifier });
      vote = await Vote.findOne({ user, comment });
    } else {
      // find vote by post
      vote = await Vote.findOne({ user, post });
    }

    if (!vote && value === 0) {
      // if no vote and value === 0 return error
      throw "Vote not found";
    } else if (!vote) {
      // if no vote create it
      vote = new Vote({ user, value });

      if (comment) {
        vote.comment = comment;
      } else {
        vote.post = post;
      }

      await vote.save();
    } else if (value === 0) {
      // if vote exists and value === 0, remove vote from DB
      await vote.remove();
    } else if (vote.value !== value) {
      // if voted value !== current value, update value
      vote.value = value;
      await vote.save();
    }

    post = await Post.findOneOrFail(
      { identifier, slug },
      { relations: ["comments", "comments.votes", "sub", "votes"] }
    );

    post.setUserVote(user);
    post.comments.forEach(c => c.setUserVote(user));

    res.json({ data: post });
  } catch (error) {
    console.log({ voteError: error });
    res.status(500).json({ error });
  }
}

const router = Router();
router.post("/", auth, vote);

export default router;
