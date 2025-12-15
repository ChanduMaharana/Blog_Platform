import Post from "../models/post.model.js";
import Category from "../models/category.model.js";

const BASE_URL = process.env.BASE_URL || "https://blog-backend-biys.onrender.com";

const normalizeImage = (img) => {
  if (!img) return null;

  if (img.startsWith("http")) return img;

  return `${BASE_URL}/uploads/${img}`;
};

export const createPost = async (req, res) => {
  try {
    const post = await Post.create({
      ...req.body,
      coverImage: req.file?.path || null, 
      image: req.file?.path || null
    });

    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getPosts = async (req, res) => {
  try {
    const posts = await Post.findAll({
      order: [["id", "DESC"]],
      include: [{ model: Category }]
    });

    const formatted = posts.map(p => ({
      ...p.dataValues,
      image: normalizeImage(p.image),
      coverImage: normalizeImage(p.coverImage)
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getPostById = async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    res.json({
      ...post.dataValues,
      image: normalizeImage(post.image),
      coverImage: normalizeImage(post.coverImage)
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updatePost = async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const updatedData = { ...req.body };
    if (req.file) {
      updatedData.coverImage = req.file.path;
      updatedData.image = req.file.path;
    }

    await post.update(updatedData);
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
