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
  if (!post) return res.status(404).send("Not found");

  const ua = req.headers["user-agent"] || "";

  if (/googlebot|facebookexternalhit|twitterbot/i.test(ua)) {
    return res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${post.ogTitle || post.title}</title>
        <meta name="description" content="${post.metaDescription}">
        <meta property="og:title" content="${post.ogTitle || post.title}">
        <meta property="og:description" content="${post.ogDescription}">
        <meta property="og:image" content="${post.image}">
        <meta property="og:url" content="https://yourdomain.com/posts/${post.id}">
      </head>
      <body></body>
      </html>
    `);
  }

  res.json(post);
});


router.put("/:id", updatePost);
router.delete("/:id", deletePost);


router.get("/:id/comments", getComments);
router.post("/:id/comments", addComment);

export default router;
