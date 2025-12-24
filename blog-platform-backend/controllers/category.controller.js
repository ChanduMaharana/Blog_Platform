import Category from "../models/category.model.js";

export const createCategory = async (req, res) => {
  try {
    console.log("REQ BODY 👉", req.body);

    const body = req.body;
    body.name = body.name || "Unnamed Category";
    body.orderNo = body.orderNo ?? 0;

    const category = await Category.create(body);
    return res.json({ success: true, category });

  } catch (err) {
    console.error("CATEGORY ERROR FULL 👉", err);
    console.error("CATEGORY ERROR NAME 👉", err.name);
    console.error("CATEGORY ERROR MSG 👉", err.message);
    console.error("CATEGORY ERROR SQL 👉", err.sql);

    return res.status(500).json({
      error: err.name,
      message: err.message,
    });
  }
};
// GET ALL
export const getCategories = async (req, res) => {
  try {
    const list = await Category.findAll({
      order: [["orderNo", "ASC"]],
    });

    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET BY ID
export const getCategoryById = async (req, res) => {
  try {
    const c = await Category.findByPk(req.params.id);
    if (!c) return res.status(404).json({ message: "Category not found" });

    res.json(c);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE
export const updateCategory = async (req, res) => {
  try {
    const [updated] = await Category.update(req.body, {
      where: { id: req.params.id },
    });

    if (!updated) return res.status(404).json({ message: "Category not found" });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE
export const deleteCategory = async (req, res) => {
  try {
    const deleted = await Category.destroy({
      where: { id: req.params.id },
    });

    if (!deleted) return res.status(404).json({ message: "Category not found" });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
