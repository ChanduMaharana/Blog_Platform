import Post from "../models/post.model.js";
import Category from "../models/category.model.js";
import slugify from "slugify";

const BASE_URL = process.env.BASE_URL || "https://blog-backend-biys.onrender.com";

const normalizeImage = (img) => {
  if (!img) return null;
  return img.startsWith('http')
    ? img
    : `https://blog-backend-biys.onrender.com/uploads/${img}`;
};


const POPULAR_THRESHOLD = 100; 

export const createPost = async (req, res) => {
  try {
    const { categoryId } = req.body;

    if (!categoryId) {
      return res.status(400).json({
        message: "categoryId is required"
      });
    }

    const imageUrl = req.file?.path || null;

    const slug = slugify(req.body.title, {
    lower: true,
    strict: true
   });

    const post = await Post.create({
      title: req.body.title,
      description: req.body.description || "",
      content: req.body.content || "",
      author: req.body.author || "Admin",
      date: req.body.date || new Date().toDateString(),
      slug,
      image: imageUrl,
      coverImage: imageUrl,

      categoryId: Number(categoryId),

      published: req.body.published === "true" || req.body.published === true,
      featured: req.body.featured === "true" || false,
      trending: req.body.trending === "true" || false,
      views: 0,
      popular: false,

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


export const getPostBySlug = async (req, res) => {
  try {
    const post = await Post.findOne({
      where: { slug: req.params.slug },
      include: [{ model: Category, as: "Category" }],
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    await post.increment('views', { by: 1 });

    await post.reload();

    const updatedViews = Number(post.views);
    if (post.views >= POPULAR_THRESHOLD && !post.popular) {
  await post.update({ popular: true });
}

    const img = post.coverImage || post.image;

    res.json({
      id: post.id,
      title: post.title,
      slug: post.slug,
      description: post.description,
      content: post.content,
      author: post.author,
      date: post.date,
      views: post.views + 1,
      image: img,
      coverImage: img,
      Category: post.Category
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getTotalViews = async (req, res) => {
  try {
    const totalViews = await Post.sum('views');
    res.json({ totalViews: totalViews || 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


/* GET ALL */
export const getPosts = async (req, res) => {
  const posts = await Post.findAll({
    order: [["id", "DESC"]],
    include: [{ model: Category, as: "Category" }],
  });

  res.json(
    posts.map(p => ({
      id: p.id,
      title: p.title,
      slug: p.slug,  
      description: p.description,
      excerpt: p.excerpt,
      content: p.content,
      author: p.author,
      date: p.date,
      image: p.coverImage || p.image,
      coverImage: p.coverImage || p.image,
      popular: p.popular,
      featured: p.featured,
      views: Number(p.views) || 0, 
      trending: p.trending,
      Category: p.Category
    }))
  );
};

export const getPopularPosts = async (req, res) => {
  try {
    const posts = await Post.findAll({
      where: { popular: true },
      order: [["views", "DESC"]],
      limit: 5,
      include: [{ model: Category, as: "Category" }],
    });

    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



/* GET BY ID */
export const getPostById = async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id, {
      include: [{ model: Category, as: "Category" }],
    });

    if (!post) return res.status(404).json({ message: "Not found" });

    const img = post.coverImage || post.image;

    res.json({
      id: post.id,
      title: post.title,
      slug: post.slug,
      description: post.description,
      excerpt: post.excerpt,
      content: post.content,
      author: post.author,
      date: post.date,
      image: img,
      coverImage: img,
      popular: post.popular,
      trending: post.trending,
      featured: post.featured,
      Category: post.Category
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
