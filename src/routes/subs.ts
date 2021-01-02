import { NextFunction, Request, Response, Router } from "express";
import { isEmpty } from "class-validator";
import { getConnection, getRepository } from "typeorm";
import multer from "multer";
import path from "path";
import fs from "fs";

import auth from "../middleware/auth";
import userAuth from "../middleware/user";
import Sub from "../entities/Sub";
import Post from "../entities/Post";
import { randomString } from "../utils/helper";
import User from "../entities/User";
import config from "../config";

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

const ownSub = async (req: Request, res: Response, next: NextFunction) => {
  const user: User = res.locals.user;

  try {
    const sub = await Sub.findOneOrFail({ where: { name: req.params.name } });

    if (sub.username !== user.username) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    res.locals.sub = sub;

    next();
  } catch (error) {
    console.log({ ownSubError: error });

    res.status(500).json({ error: "sub not found" });
  }
};

const upload = multer({
  storage: multer.diskStorage({
    destination: "public/images",
    filename: (_, file, callback) => {
      const name = randomString(15);
      callback(null, name + path.extname(file.originalname));
    },
  }),
  fileFilter: (_, file, callback) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
      callback(null, true);
    } else {
      callback(new Error("Only image please"));
    }
  },
});
async function uploadSubImage(req: Request, res: Response) {
  const sub = res.locals.sub;

  try {
    const type = req.body.type;

    if (type !== "image" && type !== "banner") {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: "Invalid type" });
    }

    const urn = req.file.filename;
    let oldImageUrn: string = "";
    if (type === "image") {
      oldImageUrn = sub.imageUrn || "";
      sub.imageUrn = urn;
    } else if (type === "banner") {
      oldImageUrn = sub.bannerUrn || "";
      sub.bannerUrn = urn;
    }

    await sub.save();

    if (oldImageUrn) {
      fs.unlinkSync(`public\\images\\${oldImageUrn}`);
    }

    res.json({ success: true });
  } catch (error) {
    console.log({ uploadImageError: error });

    res.status(500).json({ error: "Something went wrong" });
  }
}

async function topSubs(_: Request, res: Response) {
  try {
    /**
     * SELECT s.title, s.name
     * COALESCE('http://localhost:4000/images' || s."imageUrn", 'https://styles.redditmedia.com/t5_2qh1i/styles/communityIcon_tijjpyw1qe201.png) as imageUrl
     * count(p.id) s 'postCount'
     * From subs s
     * LEFT JOIN posts p ON s.name = p.sub_name
     * GROUP BY s.title, s.name, imageUrl
     * ORDER BY "postCount" DESC
     * LIMIT 5
     */

    const imageUrlExp = `COALESCE('${config.APP_URL}/images/' || s."imageUrn", 'https://styles.redditmedia.com/t5_2qh1i/styles/communityIcon_tijjpyw1qe201.png')`;
    const subs = await getConnection()
      .createQueryBuilder()
      .select(
        `s.title, s.name, ${imageUrlExp} as "imageUrl", count(p.id) as "postCount"`
      )
      .from(Sub, "s")
      .leftJoin(Post, "p", `s.name = p.sub_name`)
      .groupBy(`s.title, s.name, "imageUrl"`)
      .orderBy(`"postCount"`, "DESC")
      .limit(5)
      .execute();

    res.json({ data: subs });
  } catch (error) {
    console.log({ topSubError: error });

    res.status(500).json({ error: "Something went wrong" });
  }
}

const router = Router();

router.post("/", userAuth, auth, createSub);
router.get("/top-subs", topSubs);
router.get("/:name", userAuth, getSub);
router.post(
  "/:name/image",
  userAuth,
  auth,
  ownSub,
  upload.single("file"),
  uploadSubImage
);

export default router;
