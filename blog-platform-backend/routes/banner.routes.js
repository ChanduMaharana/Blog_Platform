import express from "express";
import { upload } from "../middleware/uploads.js";

import {
  createBanner,
  getBanners,
  getBannerById,
  updateBanner,
  deleteBanner,
} from "../controllers/banner.controller.js";

const router = express.Router();

router.post("/", upload.single("image"), createBanner);
router.get("/", getBanners);
router.get("/:id", getBannerById);
router.put("/:id", uploadBanner.single("image"), updateBanner);
router.delete("/:id", deleteBanner);


export default router;
