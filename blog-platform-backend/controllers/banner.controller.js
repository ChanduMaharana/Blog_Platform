import Banner from "../models/banner.model.js";

const BASE_URL = "https://blog-platform-backend.up.railway.app";
// const BASE_URL = `${req.protocol}://${req.get("host")}`;

export const createBanner = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    const banner = await Banner.create({
      title: req.body.title || "Untitled Banner",
      redirectUrl: req.body.redirectUrl || null,
      orderNo: req.body.orderNo ? Number(req.body.orderNo) : 0,
      active: req.body.active === "true" || req.body.active === true,
      image: req.file.filename,
    });

    res.json({ success: true, banner });

  } catch (err) {
    console.error("createBanner ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

export const getBanners = async (req, res) => {
  try {
    const list = await Banner.findAll({
      order: [["orderNo", "ASC"]],
    });

    const banners = list.map((b) => ({
      ...b.dataValues,
      image: `${BASE_URL}/uploads/banners/${b.image}`,
    }));

    res.json(banners);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getBannerById = async (req, res) => {
  try {
    const banner = await Banner.findByPk(req.params.id);
    if (!banner) return res.status(404).json({ message: "Banner not found" });

    res.json({
      ...banner.dataValues,
      image: `${BASE_URL}/uploads/banners/${banner.image}`,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateBanner = async (req, res) => {
  try {
    const updatedData = req.body;

    if (req.file) {
      updatedData.image = req.file.filename;
    }

    const [updated] = await Banner.update(updatedData, {
      where: { id: req.params.id },
    });

    if (!updated) return res.status(404).json({ message: "Banner not found" });

    res.json({ success: true });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteBanner = async (req, res) => {
  try {
    const deleted = await Banner.destroy({
      where: { id: req.params.id },
    });

    if (!deleted) return res.status(404).json({ message: "Banner not found" });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
