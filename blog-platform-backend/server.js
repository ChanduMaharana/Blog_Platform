import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import sequelize from "./config/db.js";
import compression from "compression";
import postRoutes from "./routes/post.routes.js";
// import commentRoutes from "./routes/comment.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import bannerRoutes from "./routes/banner.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import Post from "./post.model.js";
import Category from "./category.model.js";
import "./models/admin.model.js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



app.use(
  cors({
    origin: [
      "https://blog-platform-xybron-git-master-220101120198s-projects.vercel.app",
      "http://localhost:4200",
    ],
    methods: "GET,POST,PUT,PATCH,DELETE",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
Post.belongsTo(Category, { foreignKey: "categoryId" });
Category.hasMany(Post, { foreignKey: "categoryId" });
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use(compression());



process.on("uncaughtException", (err) => {
  console.error("FATAL ERROR ->", err);
});
process.on("unhandledRejection", (err) => {
  console.error("PROMISE ERROR ->", err);
});
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

app.use("/api/admin", adminRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/banners", bannerRoutes);



sequelize
  .sync()
  .then(() => {
    console.log("Database synced");
    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error("DB sync failed", err));
