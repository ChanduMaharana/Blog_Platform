// controllers/post.controller.js
import Post from "../models/post.model.js";
import Category from "../models/category.model.js";

export const createPost = async (req, res) => {
  try {
    const body = { ...req.body };

    body.title = body.title || "Untitled";
    body.description = body.description || "";
    body.content = body.content || "";
    body.author = body.author || "Unknown";
    body.date = new Date().toDateString();

    if (!body.categoryId) return res.status(400).json({ message: "categoryId is required" });

    if (req.file) {
      const BASE_URL = `${req.protocol}://${req.get("host")}`;
      body.image = `/uploads/${req.file.filename}`;            // store relative path in DB
      body.coverImage = `/uploads/${req.file.filename}`;
    }

    const post = await Post.create(body);
    res.json({ success: true, post });
  } catch (err) {
    console.error("createPost error:", err);
    res.status(500).json({ message: err.message });
  }
};

export const getPosts = async (req, res) => {
  try {
    const posts = await Post.findAll({
      order: [["id", "DESC"]],
      include: [{ model: Category }]
    });

    const BASE_URL = `${req.protocol}://${req.get("host")}`;
    const mapped = posts.map(p => ({
      ...p.dataValues,
      coverImage: p.coverImage ? `${BASE_URL}${p.coverImage}` : null,
      image: p.image ? `${BASE_URL}${p.image}` : null
    }));

    res.json(mapped);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



export const getBannerById = async (req, res) => {
  try {
    const banner = await Banner.findByPk(req.params.id);
    if (!banner) return res.status(404).json({ message: "Banner not found" });

    const BASE_URL = `${req.protocol}://${req.get("host")}`;

    res.json({
      ...banner.dataValues,
      image: `${BASE_URL}/uploads/banners/${banner.image}`,
    });

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
function normalizeImage(img) {
  if (!img) return null;
  if (img.startsWith("http")) return img; 
  return `${process.env.BASE_URL || ""}${img}`;
}


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
