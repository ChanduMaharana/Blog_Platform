import express from "express";
import { upload } from "../middleware/uploads.js";
import {
  createPost,getPosts,updatePost,deletePost,getPaginatedPosts,} from "../controllers/post.controller.js";
import { getComments, addComment } from "../controllers/comment.controller.js";

// import { isBot } from "../utils/isBot.js";
// import { seoHTML } from "../utils/seoTemplate.js";
import Post from "../models/post.model.js";

const router = express.Router();

router.post("/", upload.single("image"), createPost);

router.get("/paginated/list", getPaginatedPosts);

router.get("/", getPosts);

router.get("/:id", async (req, res) => {
  const post = await Post.findByPk(req.params.id);
  if (!post) return res.status(404).send("Not found");

  const ua = req.headers["user-agent"] || "";
  const isBot = /googlebot|facebookexternalhit|twitterbot|linkedinbot|whatsapp/i.test(ua);

  if (isBot) {
    const image =
      post.coverImage?.startsWith("http")
        ? post.coverImage
        : `${process.env.BASE_URL}/uploads/${post.coverImage}`;

    return res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <title>${post.ogTitle || post.title}</title>
        <meta name="description" content="${post.metaDescription || ""}">

        <meta property="og:title" content="${post.ogTitle || post.title}">
        <meta property="og:description" content="${post.ogDescription || post.metaDescription || ""}">
        <meta property="og:image" content="${image}">
        <meta property="og:url" content="https://blog-platform-xybron-git-master-220101120198s-projects.vercel.app/${post.id}">
        <meta property="og:type" content="article">

        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:image" content="${image}">
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
