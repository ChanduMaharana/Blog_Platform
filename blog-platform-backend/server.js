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
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const APP_ROOT = process.cwd();

const UPLOADS_DIR = path.join(APP_ROOT, "uploads");
const BANNERS_DIR = path.join(UPLOADS_DIR, "banners");


if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });
if (!fs.existsSync(BANNERS_DIR)) fs.mkdirSync(BANNERS_DIR, { recursive: true });


// app.use("/uploads", express.static(UPLOADS_DIR));
// app.use("/uploads/banners", express.static(BANNERS_DIR));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use(
  cors({
    origin: "*",
    methods: "GET,POST,PUT,PATCH,DELETE",
    allowedHeaders: "Content-Type, Authorization",
  })
);

app.use(compression());

app.use("/api/admin", adminRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/banners", bannerRoutes);

Post.belongsTo(Category, { foreignKey: "categoryId" });
Category.hasMany(Post, { foreignKey: "categoryId" });

sequelize
.sync({ alter: false })
  .then(() => {
    const PORT = process.env.PORT || 8080;
     console.log("Banners Folder:", BANNERS_DIR);
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => console.error("DB sync failed ❌", err));
