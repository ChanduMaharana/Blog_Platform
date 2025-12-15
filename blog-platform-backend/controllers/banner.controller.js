import Banner from "../models/banner.model.js";

export const createBanner = async (req, res) => {
  try {
    if (!req.file?.path) {
      return res.status(400).json({ message: "Image is required" });
    }

    const banner = await Banner.create({
      title: req.body.title || "Untitled Banner",
      redirectUrl: req.body.redirectUrl || null,
      orderNo: Number(req.body.orderNo) || 0,
      active: req.body.active !== "false",
      image: req.file.path, 
    });

    res.json({ success: true, banner });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getBanners = async (req, res) => {
  try {
    const banners = await Banner.findAll({
      where: { active: true },
      order: [["orderNo", "ASC"]],
    });

    res.json(banners);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getBannerById = async (req, res) => {
  const banner = await Banner.findByPk(req.params.id);
  if (!banner) return res.status(404).json({ message: "Not found" });
  res.json(banner);
};

export const updateBanner = async (req, res) => {
  const banner = await Banner.findByPk(req.params.id);
  if (!banner) return res.status(404).json({ message: "Not found" });

  const data = { ...req.body };
  if (req.file?.path) data.image = req.file.path;

  await banner.update(data);
  res.json({ success: true });
};

export const deleteBanner = async (req, res) => {
  await Banner.destroy({ where: { id: req.params.id } });
  res.json({ success: true });
};
