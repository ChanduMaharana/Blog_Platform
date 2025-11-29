import multer from "multer";
import path from "path";
import fs from "fs";

const bannerDir = "uploads/banners";
if (!fs.existsSync(bannerDir)) {
  fs.mkdirSync(bannerDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, bannerDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, "banner_" + Date.now() + ext);
  }
});

const uploadBanner = multer({ storage });

export default uploadBanner;
