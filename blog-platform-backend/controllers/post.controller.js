import Post from "../models/post.model.js";
import Category from "../models/category.model.js";

const BASE_URL = process.env.BASE_URL || "https://blog-backend-biys.onrender.com";

// ✅ Universal image resolver
const resolveImage = (img) => {
  if (!img) return null;

  // Cloudinary URL → return as-is
  if (img.startsWith("http")) return img;

  // Old local filename → convert to full URL
  return `${BASE_URL}/uploads/${img}`;
};

// CREATE POST
export const createPost = async (req, res) => {
  try {
    const post = await Post.create({
      ...req.body,
      coverImage: req.file?.path || null, // Cloudinary URL
    });

    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET ALL POSTS
export const getPosts = async (req, res) => {
  try {
    const posts = await Post.findAll({
      order: [["id", "DESC"]],
      include: [{ model: Category }],
    });

    const formatted = posts.map((p) => ({
      ...p.dataValues,
      image: resolveImage(p.coverImage || p.image),
      coverImage: resolveImage(p.coverImage || p.image),
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET POST BY ID
export const getPostById = async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    res.json({
      ...post.dataValues,
      image: resolveImage(post.coverImage || post.image),
      coverImage: resolveImage(post.coverImage || post.image),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE POST
export const updatePost = async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const updatedData = { ...req.body };

    if (req.file) {
      updatedData.coverImage = req.file.path; // Cloudinary URL
    }

    await post.update(updatedData);
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
