import Post from "../models/post.model.js";
import Category from "../models/category.model.js";

const BASE_URL = process.env.BASE_URL || "https://blog-backend-biys.onrender.com";

const normalizeImage = (img) =>
  img?.startsWith('http')
    ? img
    : `https://blog-backend-biys.onrender.com/uploads/${img}`;


export const createPost = async (req, res) => {
  try {
    const imageUrl = req.file?.path || null;

    const post = await Post.create({
      ...req.body,
      image: imageUrl,
      coverImage: imageUrl,
    });

    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* GET ALL */
export const getPosts = async (req, res) => {
  const posts = await Post.findAll({
    order: [["id", "DESC"]],
    include: [{ model: Category }],
  });

  res.json(
    posts.map(p => ({
      ...p.dataValues,
      image: normalizeImage(p.image),
      coverImage: normalizeImage(p.coverImage),
    }))
  );
};

/* GET BY ID */
export const getPostById = async (req, res) => {
  const post = await Post.findByPk(req.params.id);
  if (!post) return res.status(404).json({ message: "Not found" });

  res.json({
    ...post.dataValues,
    image: normalizeImage(post.image),
    coverImage: normalizeImage(post.coverImage),
  });
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
