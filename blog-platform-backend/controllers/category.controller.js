import Category from "../models/category.model.js";

export const createCategory = async (req, res) => {
  try {
    const { name, orderNo = 0, active = true } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({ message: "Category name is required" });
    }

    const category = await Category.create({
      name: name.trim(),
      orderNo,
      active,
    });

    res.status(201).json({ success: true, category });

  } catch (err) {
    console.error("CATEGORY CREATE ERROR 👉", err);

    if (err.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ message: "Category already exists" });
    }

    res.status(500).json({ message: err.message });
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
