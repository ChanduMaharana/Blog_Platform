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

// FIXED POST BY ID ROUTE
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id, {
      include: [{ model: Category }]
    });
    
    if (!post) return res.status(404).send("Post not found");

    const BASE_URL = process.env.BASE_URL || "https://blog-backend-biys.onrender.com";
    const FRONTEND_URL = "https://blog-platform-xybron-git-master-220101120198s-projects.vercel.app";
    
    const image = post.image?.startsWith("http")
      ? post.image
      : `${BASE_URL}/uploads/${post.image}`;

    const canonicalUrl = `${FRONTEND_URL}/post/${post.id}`;
    const ua = req.headers["user-agent"] || "";
    const isBot = /googlebot|facebookexternalhit|twitterbot|linkedinbot|whatsapp|telegrambot|slackbot|discordbot|bingbot|baiduspider|yandexbot/i.test(ua.toLowerCase());

    if (isBot) {
      // Complete HTML for bots
      const botHtml = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${post.ogTitle || post.title || 'Blog Post'}</title>
          <meta name="description" content="${post.metaDescription || post.description || ''}">
          <meta name="keywords" content="${post.metaKeywords || ''}">
          
          <!-- Open Graph / Facebook -->
          <meta property="og:type" content="article">
          <meta property="og:url" content="${canonicalUrl}">
          <meta property="og:title" content="${post.ogTitle || post.title || ''}">
          <meta property="og:description" content="${post.ogDescription || post.metaDescription || post.description || ''}">
          <meta property="og:image" content="${image}">
          <meta property="og:site_name" content="BlogPlatform">
          
          <!-- Twitter -->
          <meta property="twitter:card" content="summary_large_image">
          <meta property="twitter:url" content="${canonicalUrl}">
          <meta property="twitter:title" content="${post.ogTitle || post.title || ''}">
          <meta property="twitter:description" content="${post.ogDescription || post.metaDescription || post.description || ''}">
          <meta property="twitter:image" content="${image}">
          
          <!-- Canonical -->
          <link rel="canonical" href="${canonicalUrl}">
          
          <!-- Schema.org markup -->
          <script type="application/ld+json">
          {
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": "${post.title || ''}",
            "description": "${post.metaDescription || post.description || ''}",
            "image": "${image}",
            "author": {
              "@type": "Person",
              "name": "${post.author || 'Unknown'}"
            },
            "publisher": {
              "@type": "Organization",
              "name": "BlogPlatform",
              "logo": {
                "@type": "ImageObject",
                "url": "${FRONTEND_URL}/favicon.ico"
              }
            },
            "datePublished": "${post.date || new Date().toISOString()}",
            "dateModified": "${post.updatedAt || new Date().toISOString()}"
          }
          </script>
        </head>
        <body>
          <article>
            <h1>${post.title || ''}</h1>
            <img src="${image}" alt="${post.title || 'Post image'}" />
            <p><strong>Author:</strong> ${post.author || 'Unknown'}</p>
            <p><strong>Published:</strong> ${post.date || ''}</p>
            <div>${post.content || post.description || ''}</div>
            <p>Read the full article at: <a href="${canonicalUrl}">${canonicalUrl}</a></p>
          </article>
        </body>
        </html>
      `;
      
      return res.send(botHtml);
    }

    res.json({
      ...post.dataValues,
      image: image,
      coverImage: image,
      canonicalUrl: canonicalUrl
    });
    
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/:id", upload.single("image"), updatePost);
router.delete("/:id", deletePost);
router.get("/:id/comments", getComments);
router.post("/:id/comments", addComment);

export default router;