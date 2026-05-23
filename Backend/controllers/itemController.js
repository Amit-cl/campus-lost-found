const Item = require("../models/Item");
const Claim = require("../models/Claim");
const imagekit = require("../config/imagekit");

exports.createItem = async (req, res) => {
  try {
    const { title, type, category, description, location, itemDate, contact } = req.body;

    if (!title || !type || !category || !description || !location || !itemDate || !contact) {
      return res.status(400).json({ message: "Please fill all required fields." });
    }

    let imageUrl = "";
    let imageFileId = "";

    if (req.file) {
      const uploaded = await imagekit.upload({
        file: req.file.buffer,
        fileName: `${Date.now()}-${req.file.originalname}`,
        folder: "/campus-lost-found-v2",
      });
      imageUrl = uploaded.url;
      imageFileId = uploaded.fileId;
    }

    const item = await Item.create({
      title,
      type,
      category,
      description,
      location,
      itemDate,
      contact,
      imageUrl,
      imageFileId,
      postedBy: req.user._id,
    });

    res.status(201).json({ message: "Item posted successfully.", item });
  } catch (error) {
    res.status(500).json({ message: "Failed to post item.", error: error.message });
  }
};

exports.getItems = async (req, res) => {
  try {
    const { type, category, location, status, search } = req.query;
    const filter = {};

    if (type && type !== "all") filter.type = type;
    if (category && category !== "all") filter.category = category;
    if (location && location !== "all") filter.location = location;
    if (status && status !== "all") filter.status = status;

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
      ];
    }

    const items = await Item.find(filter).populate("postedBy", "name email").sort({ createdAt: -1 });
    res.json({ items });
  } catch (error) {
    res.status(500).json({ message: "Failed to get items.", error: error.message });
  }
};

exports.getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate("postedBy", "name email").populate("approvedClaim");
    if (!item) return res.status(404).json({ message: "Item not found." });
    res.json({ item });
  } catch (error) {
    res.status(500).json({ message: "Failed to get item.", error: error.message });
  }
};

exports.getMyItems = async (req, res) => {
  try {
    const items = await Item.find({ postedBy: req.user._id }).sort({ createdAt: -1 });
    res.json({ items });
  } catch (error) {
    res.status(500).json({ message: "Failed to get your posts.", error: error.message });
  }
};

exports.deleteMyItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found." });

    if (item.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only the poster can delete this item." });
    }

    await Claim.deleteMany({ item: item._id });
    await item.deleteOne();
    res.json({ message: "Item deleted." });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete item.", error: error.message });
  }
};
