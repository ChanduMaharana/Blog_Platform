import express from "express";
import { upload } from "../middleware/uploads.js";

import {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  getPaginatedPosts
} from "../controllers/post.controller.js";

import { getComments, addComment } from "../controllers/comment.controller.js";

const router = express.Router();

router.get("/paginated/list", getPaginatedPosts);

router.get("/", getPosts);
router.get("/:id", getPostById);

router.post("/", upload.single("image"), createPost);

router.put("/:id", updatePost);
router.delete("/:id", deletePost);

router.get("/:id/comments", getComments);
router.post("/:id/comments", addComment);

export default router;
