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

router.get("/:id", async (req, res) => {
  const post = await Post.findByPk(req.params.id);
  if (!post) return res.status(404).send("Not found");

  const ua = req.headers["user-agent"] || "";
  const isBot = /facebookexternalhit|twitterbot|linkedinbot|googlebot|whatsapp/i.test(ua);

  const image = post.image?.startsWith("http")
    ? post.image
    : `https://blog-backend-biys.onrender.com/uploads/${post.image}`;

  if (isBot) {
    return res.status(200).send(`
<!DOCTYPE html>
<html lang="en">
<head>
<title>${post.ogTitle || post.title}</title>

<meta name="description" content="${post.metaDescription || ""}">

<meta property="og:title" content="${post.ogTitle || post.title}">
<meta property="og:description" content="${post.ogDescription || post.metaDescription || ""}">
<meta property="og:image" content="${image}">
<meta property="og:type" content="article">
<meta property="og:url" content="https://blog-platform-xybron-git-master-220101120198s-projects.vercel.app/post/${post.id}">

<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="${image}">
</head>
<body></body>
</html>
`);
  }

  res.json({
    ...post.dataValues,
    image,
    coverImage: image
  });
});


router.put("/:id", upload.single("image"), updatePost);
router.delete("/:id", deletePost);
router.get("/:id/comments", getComments);
router.post("/:id/comments", addComment);

export default router;