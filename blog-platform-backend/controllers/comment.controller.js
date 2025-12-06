import Comment from "../models/comment.model.js";

export const getComments = async (req, res) => {
  try {
    const postId = req.params.id;

    const comments = await Comment.findAll({
      where: { postId },
      order: [["createdAt", "DESC"]]
    });

    res.json(comments || []); 
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const addComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const { name, email, comment } = req.body;

    const newComment = await Comment.create({
      name,
      email,
      comment,
      postId,
      createdAt: new Date()
    });

    res.json(newComment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
