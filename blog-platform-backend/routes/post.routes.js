import express from "express";
import { upload } from "../middleware/uploads.js";


import {
  createPost,
  getPosts,
  // getPostById,
  // updatePost,
  // deletePost,
  getPaginatedPosts
} from "../controllers/post.controller.js";
import { getComments, addComment } from "../controllers/comment.controller.js";

const router = express.Router();


router.get("/", getPosts);
// router.get("/:id", getPostById);
// router.put("/:id", updatePost);
// router.delete("/:id", deletePost);
router.get("/paginated/list", getPaginatedPosts);
router.post("/", upload.single("image"), createPost);


router.get("/:id/comments", getComments);
router.post("/:id/comments", addComment);

export default router;
