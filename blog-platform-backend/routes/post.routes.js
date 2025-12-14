import express from "express";
import { upload } from "../middleware/uploads.js";
import {
  createPost,
  getPosts,
  updatePost,
  deletePost,
  getPaginatedPosts,
} from "../controllers/post.controller.js";
import { getComments, addComment } from "../controllers/comment.controller.js";

import { isBot } from "../utils/isBot.js";
import { seoHTML } from "../utils/seoTemplate.js";
import Post from "../models/post.model.js";

const router = express.Router();

router.post("/", upload.single("image"), createPost);

router.get("/paginated/list", getPaginatedPosts);

router.get("/", getPosts);

router.get("/:id", async (req, res) => {
  const post = await Post.findByPk(req.params.id);

  if (!post) return res.status(404).json({ message: "Post not found" });

  const ua = req.headers["user-agent"] || "";

  if (isBot(ua)) {
    return res
      .status(200)
      .set("Content-Type", "text/html")
      .send(seoHTML(post));
  }

  return res.json(post);
});

router.put("/:id", updatePost);
router.delete("/:id", deletePost);


router.get("/:id/comments", getComments);
router.post("/:id/comments", addComment);

export default router;
