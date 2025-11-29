import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { sequelize } from "./config/db.js";

import postRoutes from "./routes/post.routes.js";
import commentRoutes from "./routes/comment.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import bannerRoutes from "./routes/banner.routes.js";

import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use(
  cors({
    origin: [
      "https://browser-ne7dz238c-220101120198s-projects.vercel.app",
      "http://localhost:4200",
    ],
    credentials: true,
  })
);

app.use(express.json());

process.on("uncaughtException", (err) => {
  console.error("FATAL ERROR ->", err);
});
process.on("unhandledRejection", (err) => {
  console.error("PROMISE ERROR ->", err);
});

app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/banners", bannerRoutes);

sequelize
  .sync()
  .then(() => {
    console.log("Database synced");
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error("DB sync failed", err));
