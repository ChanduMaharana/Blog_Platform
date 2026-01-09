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

router.get('/share/:slug', async (req, res) => {
  const post = await Post.findOne({ where: { slug: req.params.slug } });
  if (!post) return res.sendStatus(404);

  const image = post.coverImage;

  const frontendUrl =
    `https://blog-platform-chi-three.vercel.app/post/${post.slug}`;

  res.status(200).send(`
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${post.ogTitle || post.title}</title>

<meta property="og:title" content="${post.ogTitle || post.title}">
<meta property="og:description" content="${post.metaDescription || post.description || ''}">
<meta property="og:image" content="${image}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:type" content="article">
<meta property="og:url" content="${frontendUrl}">

<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="${image}">

<meta http-equiv="refresh" content="0;url=${frontendUrl}">
</head>
<body></body>
</html>
`);
});

router.get('/slug/:slug', async (req, res) => {
  const post = await Post.findOne({
    where: { slug: req.params.slug },
    include: [{ model: Category, as: 'Category' }]
  });

  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }

  await post.increment('views');

  res.json({
    id: post.id,
    title: post.title,
    slug: post.slug,
    description: post.description,
    content: post.content,
    image: post.coverImage || post.image,
    coverImage: post.coverImage || post.image,
    Category: post.Category
  });
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



router.put("/:id", upload.single("image"), updatePost);

router.delete("/:id", deletePost);

router.get("/:id/comments", getComments);
router.post("/:id/comments", addComment);

export default router;
