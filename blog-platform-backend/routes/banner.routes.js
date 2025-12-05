import express from "express";
import { createBanner, updateBanner, deleteBanner, getAllBanners } from "../controllers/banner.controller.js";
import multer from "multer";

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/banners/");
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
