import express from "express";
import multer from "multer";
import fs from "fs";

import {
  createBanner,
  updateBanner,
  deleteBanner,
  getBanners,
  getBannerById,
} from "../controllers/banner.controller.js";
import { BANNER_PATH } from "../server.js";

const router = express.Router();

if (!fs.existsSync(BANNER_PATH)) {
    fs.mkdirSync(BANNER_PATH, { recursive: true });
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, BANNER_PATH);
  },
  filename(req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const uploadBanner = multer({ storage });

router.get("/", getBanners);
router.get("/:id", getBannerById);

router.post("/", uploadBanner.single("image"), createBanner);
router.put("/:id", uploadBanner.single("image"), updateBanner);
router.delete("/:id", deleteBanner);

export default router;
