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

    if (!body.categoryId)
      return res.status(400).json({ message: "categoryId is required" });

    const post = await Post.create(body);
    res.json({ success: true, post });

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
      include: [{ model: Category }] // 🔥 JOIN
    });

    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// GET BY ID
export const getPostById = async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    res.json(post);
  } catch (err) {
    console.error("getPostById error", err);
    res.status(500).json({ message: err.message });
  }
};

// UPDATE
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

// DELETE
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

