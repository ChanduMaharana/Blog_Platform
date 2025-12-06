import express from "express";
import multer from "multer";
import fs from "fs";
import { BANNERS_PATH } from "../config/paths.js";

const router = express.Router();

if (!fs.existsSync(BANNERS_PATH)) {
  fs.mkdirSync(BANNERS_PATH, { recursive: true });
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, BANNERS_PATH);
  },
  filename(req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const uploadBanner = multer({ storage });

router.get("/:id", getBannerById);
router.post("/", uploadBanner.single("image"), createBanner);
router.put("/:id", uploadBanner.single("image"), updateBanner);
router.delete("/:id", deleteBanner);

export default router;
