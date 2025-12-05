import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import sequelize from "./config/db.js";
import compression from "compression";
import path from "path";
import { fileURLToPath } from "url";

import postRoutes from "./routes/post.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import bannerRoutes from "./routes/banner.routes.js";
import adminRoutes from "./routes/admin.routes.js";

dotenv.config();
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(
  cors({
    origin: [
      "https://blog-platform-xybron-git-master-220101120198s-projects.vercel.app",
      "http://localhost:4200"
    ],
    methods: "GET,POST,PUT,PATCH,DELETE",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use(compression());

app.use((req, res, next) => {
  console.time(`Request → ${req.method} ${req.path}`);
  res.on("finish", () => {
    console.timeEnd(`Request → ${req.method} ${req.path}`);
  });
  next();
});

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

app.use("/api/admin", adminRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/banners", bannerRoutes);

process.on("uncaughtException", console.error);
process.on("unhandledRejection", console.error);

sequelize.sync({ alter: false })
  .then(() => {
    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error("❌ DATABASE CONNECTION FAILED");
    console.error(err);
  });

