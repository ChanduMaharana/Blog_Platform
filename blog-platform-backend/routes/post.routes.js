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
import Post from "../models/post.model.js";
import Category from "../models/category.model.js";

const router = express.Router();

router.post("/", upload.single("image"), createPost);

router.get("/paginated/list", getPaginatedPosts);

router.get("/", getPosts);

router.get("/slug/:slug", async (req, res) => {
  const ua = req.headers["user-agent"] || "";
  const isBot =
    /facebookexternalhit|twitterbot|linkedinbot|googlebot|whatsapp/i.test(ua);

  const post = await Post.findOne({
    where: { slug: req.params.slug },
    include: [{ model: Category, as: "Category" }],
  });

  if (!post) return res.status(404).send("Not found");

  if (!isBot) {
    return res.json(post);
  }

  const image = post.coverImage || post.image;

  return res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <title>${post.ogTitle || post.title}</title>
  <meta name="description" content="${post.metaDescription || ""}">

  <meta property="og:title" content="${post.ogTitle || post.title}">
  <meta property="og:description" content="${post.metaDescription || ""}">
  <meta property="og:image" content="${image}">
  <meta property="og:type" content="article">
  <meta property="og:url" content="https://blog-platform-xybron-git-master-220101120198s-projects.vercel.app/post/${post.slug}">

  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:image" content="${image}">
</head>
<body></body>
</html>
`);
});

router.get("/:id", async (req, res) => {
  const post = await Post.findByPk(req.params.id, {
    include: [{ model: Category, as: "Category" }],
  });

  if (!post) return res.status(404).send("Not found");

  res.json(post);
});

router.put("/:id", upload.single("image"), updatePost);

router.delete("/:id", deletePost);

router.get("/:id/comments", getComments);
router.post("/:id/comments", addComment);

export default router;
