import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { sequelize } from './config/db.js';
import postRoutes from './routes/post.routes.js';
import path from 'path';
import { fileURLToPath } from 'url';
import commentRoutes from "./routes/comment.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import bannerRoutes from "./routes/banner.routes.js";


dotenv.config();
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.use(cors({ origin: 'http://localhost:4200', credentials: true }));
app.use(express.json());

process.on("uncaughtException", err => {
  console.error("FATAL ERROR ->", err);
});
process.on("unhandledRejection", err => {
  console.error("PROMISE ERROR ->", err);
});


app.use("/uploads", express.static("uploads")); 
app.use("/api/banners", bannerRoutes);


app.use('/api/posts', postRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/posts", commentRoutes);

sequelize.sync().then(() => {
  console.log('Database synced');
  app.listen(process.env.PORT || 3000, () => {
    console.log(`Server running on port ${process.env.PORT || 3000}`);
  });
}).catch(err => console.error('DB sync failed', err));
