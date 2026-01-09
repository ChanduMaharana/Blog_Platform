import express from "express";
import { upload } from "../middleware/uploads.js";
import {
  createPost,
  getPosts,
  updatePost,
  deletePost,
  getTotalViews,
  getPaginatedPosts,
} from "../controllers/post.controller.js";
import { getComments, addComment } from "../controllers/comment.controller.js";
import Post from "../models/post.model.js";
import Category from "../models/category.model.js";

const router = express.Router();

app.use((req, res, next) => {
  const ua = req.headers['user-agent'] || '';

  if (ua.includes('facebookexternalhit')) {
    return next();
  }

  next();
});


router.get("/share/:slug", async (req, res) => {
  try {
    const post = await Post.findOne({ where: { slug: req.params.slug } });
    if (!post) return res.status(404).send("Not found");

    const image = post.coverImage
      ? post.coverImage.startsWith("http")
        ? post.coverImage
        : `https://blog-backend-biys.onrender.com/uploads/${post.coverImage}`
      : "https://blog-backend-biys.onrender.com/uploads/default-og.jpg";

    const frontendUrl = `https://blog-platform-chi-three.vercel.app/post/${post.slug}`;

    res.status(200).send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${post.ogTitle || post.title}</title>

  <meta name="description" content="${post.metaDescription || post.description || ""}"/>

  <!-- Open Graph -->
  <meta property="og:title" content="${post.ogTitle || post.title}" />
  <meta property="og:description" content="${post.metaDescription || post.description || ""}" />
  <meta property="og:image" content="${image}" />
  <meta property="og:image:secure_url" content="${image}" />
  <meta property="og:type" content="article" />
  <meta property="og:url" content="${frontendUrl}" />

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${post.ogTitle || post.title}" />
  <meta name="twitter:description" content="${post.metaDescription || post.description || ""}" />
  <meta name="twitter:image" content="${image}" />

  <!-- Human redirect -->
  <meta http-equiv="refresh" content="0;url=${frontendUrl}" />
</head>
<body></body>
</html>
`);
  } catch (err) {
    console.error("SHARE ROUTE ERROR", err);
    res.status(500).send("Server error");
  }
});


router.post("/", upload.single("image"), createPost);

router.get("/paginated/list", getPaginatedPosts);
router.get('/posts/stats/total-views', getTotalViews);
router.get("/", getPosts);

router.get("/:id", async (req, res) => {
  const post = await Post.findByPk(req.params.id, {
    include: [{ model: Category, as: "Category" }],
  });

  if (!post) return res.status(404).send("Not found");

  res.json(post);
});

app.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  res.send(`
User-agent: *
Allow: /

User-agent: facebookexternalhit
Allow: /

User-agent: Twitterbot
Allow: /

User-agent: LinkedInBot
Allow: /
`);
});


router.put("/:id", upload.single("image"), updatePost);

router.delete("/:id", deletePost);

router.get("/:id/comments", getComments);
router.post("/:id/comments", addComment);

export default router;
