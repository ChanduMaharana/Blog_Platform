import express from "express";
import { createBanner, updateBanner, deleteBanner, getAllBanners } from "../controllers/banner.controller.js";
import multer from "multer";
import fs from "fs";

const bannerDir = "uploads/banners";

if (!fs.existsSync(bannerDir)) {
  fs.mkdirSync(bannerDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, bannerDir);
  },
  filename(req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});


const uploadBanner = multer({ storage });

const router = express.Router();

router.post("/", uploadBanner.single("image"), createBanner);
router.put("/:id", uploadBanner.single("image"), updateBanner);
router.delete("/:id", deleteBanner);
router.get("/", getAllBanners);

export default router;
