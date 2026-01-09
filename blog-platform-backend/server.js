import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import sequelize from "./config/db.js";
import compression from "compression";

import postRoutes from "./routes/post.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import bannerRoutes from "./routes/banner.routes.js";
import adminRoutes from "./routes/admin.routes.js";

import Post from "./models/post.model.js";
import Category from "./models/category.model.js";
import "./models/admin.model.js";

import path from "path";
import fs from "fs";
import { createDefaultAdmin } from "./utils/createDefaultAdmin.js";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const APP_ROOT = process.cwd();

const UPLOADS_DIR = path.join(APP_ROOT, "uploads");
const BANNERS_DIR = path.join(UPLOADS_DIR, "banners");

app.use((req, res, next) => {
  const ua = req.headers['user-agent'] || '';

  if (ua.includes('facebookexternalhit')) {
    return next();
  }

  next();
});

if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });
if (!fs.existsSync(BANNERS_DIR)) fs.mkdirSync(BANNERS_DIR, { recursive: true });


// app.use("/uploads", express.static(UPLOADS_DIR));
// app.use("/uploads/banners", express.static(BANNERS_DIR));

// backend server.js

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (Postman, curl)
      if (!origin) return callback(null, true);

      const allowedOrigins = [
        /^http:\/\/localhost:\d+$/, // localhost any port
        /^https:\/\/.*\.vercel\.app$/, // ALL vercel apps
        'https://blog-platform-xybron-git-master-220101120198s-projects.vercel.app'
      ];

      const isAllowed = allowedOrigins.some(o =>
        typeof o === 'string' ? o === origin : o.test(origin)
      );

      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: false
  })
);

Post.belongsTo(Category, {
  foreignKey: "categoryId",
  as: "Category",
});

Category.hasMany(Post, {
  foreignKey: "categoryId",
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

// app.get('/posts/:id', async (req, res) => {
//   const ua = req.headers['user-agent'] || '';
//   const isBot = /facebookexternalhit|twitterbot|googlebot|whatsapp/i.test(ua);

//   const post = await Post.findByPk(req.params.id);
//   if (!post) return res.status(404).send('Not found');

//   const image = post.coverImage?.startsWith('http')
//     ? post.coverImage
//     : 'https://blog-backend-biys.onrender.com/uploads/default-og.jpg';

//   if (isBot) {
//     return res.status(200).send(`
// <!DOCTYPE html>
// <html>
// <head>
// <title>${post.ogTitle || post.title}</title>
// <meta name="description" content="${post.metaDescription || ''}">

// <meta property="og:title" content="${post.ogTitle || post.title}">
// <meta property="og:description" content="${post.metaDescription || ''}">
// <meta property="og:image" content="${image}">
// <meta property="og:image:secure_url" content="${image}">
// <meta property="og:type" content="article">
// <meta property="og:url" content="https://blog-backend-biys.onrender.com/posts/${post.id}">

// <meta name="twitter:card" content="summary_large_image">
// <meta name="twitter:image" content="${image}">
// </head>
// <body></body>

// </html>
// `);
//   }

//   res.redirect(`https://blog-platform-xybron-git-master-220101120198s-projects.vercel.app/post/${post.id}`);
// });

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use(compression());

app.use("/api/admin", adminRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/banners", bannerRoutes);

Post.belongsTo(Category, { foreignKey: "categoryId" });
Category.hasMany(Post, { foreignKey: "categoryId" });

sequelize
.sync()
  .then(async () => {
    await createDefaultAdmin(); 
    const PORT = process.env.PORT || 8080;
     console.log("Banners Folder:", BANNERS_DIR);
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => console.error("DB sync failed ❌", err));
