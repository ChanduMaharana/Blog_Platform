import express from "express";
import { getComments, addComment } from "../controllers/comment.controller.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const { postId } = req.query;
  const comments = await Comment.findAll({
    where: { postId },
    order: [["createdAt", "DESC"]],
  });
  res.json(comments || []);
});

router.post("/", async (req, res) => {
  const { name, email, comment, postId } = req.body;
  const newComment = await Comment.create({
    name,
    email,
    comment,
    postId,
    createdAt: new Date(),
  });
  res.json(newComment);
});


export default router;
