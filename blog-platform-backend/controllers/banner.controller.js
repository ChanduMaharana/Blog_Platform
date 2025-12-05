import Banner from "../models/banner.model.js";

const BASE_URL = "https://blog-platform-backend.up.railway.app"; 

export const createBanner = async (req, res) => {
  try {
    const { title, redirectUrl, orderNo, active } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    const banner = await Banner.create({
      title: title || "Untitled Banner",
      redirectUrl: redirectUrl || null,
      orderNo: orderNo || 0,
      active: active ?? true,
      image: req.file.filename,
    });

    res.json({ success: true, banner });
  } catch (err) {
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

    banner.image = `${BASE_URL}/uploads/banners/${banner.image}`; 

    res.json(banner);
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
export const getAllBanners = async (req, res) => {
  try {
    const banners = await Banner.findAll();
    res.json(banners);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};