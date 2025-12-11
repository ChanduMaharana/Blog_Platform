import Post from "../models/post.model.js";
import Category from "../models/category.model.js";

const BASE_URL = process.env.BASE_URL || "https://blog-backend-biys.onrender.com";
const normalizeImage = (img) => {
  if (!img) return null;
  if (!img.startsWith("/")) {
    img = `/uploads/${img}`;
  }
  return `${BASE_URL}${img}`;
};


export const createPost = async (req, res) => {
  try {
    const body = { ...req.body };

    body.title = body.title || "Untitled";
    body.description = body.description || "";
    body.content = body.content || "";
    body.author = body.author || "Unknown";
    body.date = new Date().toDateString();

    if (!body.categoryId)
      return res.status(400).json({ message: "categoryId is required" });

    if (req.file) {
       body.image = req.file.filename;
    }

    const post = await Post.create(body);

    const formatted = {
      ...post.dataValues,
      image: normalizeImage(post.image),
      coverImage: normalizeImage(post.image),
    };

    res.json({ success: true, post: formatted });

  } catch (err) {
    console.error("createPost error:", err);
    res.status(500).json({ message: err.message });
  }
};

// GET ALL POSTS
export const getPosts = async (req, res) => {
  try {
    const posts = await Post.findAll({
      order: [["id", "DESC"]],
      include: [{ model: Category }],
    });

    const formatted = posts.map((p) => {
      const img = p.image;

      return {
        ...p.dataValues,
        image: normalizeImage(img),
       coverImage: normalizeImage(img),
      };
    });

    res.json(formatted);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const getPostById = async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);

    if (!post) return res.status(404).json({ message: "Post not found" });

    const img = post.image;

    const formatted = {
  ...post.dataValues,
  image: normalizeImage(post.image),
  coverImage: normalizeImage(post.image),

  metaDescription: post.metaDescription,
  metaKeywords: post.metaKeywords,
  ogTitle: post.ogTitle,
  ogDescription: post.ogDescription,
  excerpt: post.excerpt,
};


    res.json(formatted);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const updatePost = async (req, res) => {
  try {
    const [updated] = await Post.update(req.body, {
      where: { id: req.params.id }
    });

    if (!updated) return res.status(404).json({ message: "Post not found" });

    res.json({ success: true });

  } catch (err) {
    console.error("updatePost error", err);
    res.status(500).json({ message: err.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const deleted = await Post.destroy({
      where: { id: req.params.id }
    });

    if (!deleted) return res.status(404).json({ message: "Post not found" });

    res.json({ success: true });

  } catch (err) {
    console.error("deletePost error", err);
    res.status(500).json({ message: err.message });
  }
};

export const getPaginatedPosts = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 6;
    const offset = (page - 1) * limit;

    const { rows, count } = await Post.findAndCountAll({
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    const formatted = rows.map((p) => ({
      ...p.dataValues,
      image: normalizeImage(p.image),
      coverImage: normalizeImage(p.image),
    }));

    res.json({
      posts: formatted,
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
