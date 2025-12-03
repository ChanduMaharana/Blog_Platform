import express from "express";
import { getComments, addComment } from "../controllers/comment.controller.js";

const router = express.Router();

router.get("/:id/comments", getComments);
router.post("/:id/comments", addComment);

export default router;
