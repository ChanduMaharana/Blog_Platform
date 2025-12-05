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

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

app.use((req, res, next) => {
  console.time(`Request → ${req.method} ${req.path}`);
  res.on("finish", () => {
    console.timeEnd(`Request → ${req.method} ${req.path}`);
  });
  next();
});

app.use(compression());
app.set("timeout", 20000); 

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use(
  cors({
    origin: [
      "https://blog-platform-xybron-git-master-220101120198s-projects.vercel.app/",
      "http://localhost:4200"
    ],
    methods: "GET,POST,PUT,PATCH,DELETE",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

process.on("uncaughtException", (err) => {
  console.error("🔥 UNCAUGHT EXCEPTION →", err);
});
process.on("unhandledRejection", (err) => {
  console.error("🔥 UNHANDLED PROMISE →", err);
});

app.use("/api/admin", adminRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/banners", bannerRoutes);

sequelize
  .sync({ alter: false }) 
  .then(() => {
    console.log("Database synced");
    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () =>
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => console.error("❌ DB sync failed", err));

