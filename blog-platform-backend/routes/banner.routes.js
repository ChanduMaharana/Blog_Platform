import express from "express";
import { createBanner, updateBanner, deleteBanner, getBanners, getBannerById } from "../controllers/banner.controller.js";
import { uploadBanner } from "../middleware/bannerUpload.js";

const router = express.Router();

router.get("/", getBanners);
router.get("/:id", getBannerById);
router.post("/", uploadBanner.single("image"), createBanner);
router.put("/:id", uploadBanner.single("image"), updateBanner);
router.delete("/:id", deleteBanner);

export default router;
