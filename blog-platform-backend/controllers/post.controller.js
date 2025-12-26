import Post from "../models/post.model.js";
import Category from "../models/category.model.js";

const BASE_URL = process.env.BASE_URL || "https://blog-backend-biys.onrender.com";

const normalizeImage = (img) => {
  if (!img) return null;
  return img.startsWith('http')
    ? img
    : `https://blog-backend-biys.onrender.com/uploads/${img}`;
};



export const createPost = async (req, res) => {
  try {
    const imageUrl = req.file?.path || null;

    const post = await Post.create({
      title: req.body.title,
      description: req.body.description || "",
      content: req.body.content || "",
      author: req.body.author || "Admin",
      date: req.body.date || new Date().toDateString(),

      image: imageUrl,
      coverImage: imageUrl,

      categoryId: req.body.categoryId || null,

      published: req.body.published ?? true,
      featured: req.body.featured ?? false,
      trending: req.body.trending ?? false,
      popular: req.body.popular ?? false,
      views: req.body.views ?? 0,

      excerpt: req.body.excerpt || "",
      metaDescription: req.body.metaDescription || "",
      metaKeywords: req.body.metaKeywords || "",
      ogTitle: req.body.ogTitle || "",
      ogDescription: req.body.ogDescription || "",
    });

    res.status(201).json(post);
  } catch (err) {
    console.error("CREATE POST ERROR 👉", err);
    res.status(500).json({ error: err.message });
  }
};


/* GET ALL */
const posts = await Post.findAll({
  where: { published: true },
  order: [["id", "DESC"]],
  include: [{ model: Category, as: "Category" }],
});



/* GET BY ID */
export const getPostById = async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id, {
      include: [{ model: Category, as: "Category" }],
    });

    if (!post) return res.status(404).json({ message: "Not found" });

    const img = post.coverImage || post.image;

    res.json({
      ...post.dataValues,
      coverImage: img,
      image: img,
    });
  } catch (err) {
    console.error("GET POST BY ID ERROR 👉", err);
    res.status(500).json({ error: err.message });
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
export const deletePost = async (req, res) => {
  try {
    const deleted = await Post.destroy({
      where: { id: req.params.id }
    });

    if (!deleted) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json({ success: true });
  } catch (err) {
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

    res.json({
      posts: rows, 
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
