import path from "path";
import { fileURLToPath } from "url";

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

export const ROOT_DIR = path.join(__dirname, "..");
export const UPLOADS_PATH = path.join(ROOT_DIR, "uploads");
export const BANNERS_PATH = path.join(ROOT_DIR, "uploads/banners");
