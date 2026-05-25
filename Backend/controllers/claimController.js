const Claim = require("../models/Claim");
const Item = require("../models/Item");

exports.createClaim = async (req, res) => {
  try {
    const { itemId, message } = req.body;

    if (!itemId || !message) {
      return res.status(400).json({ message: "Item and proof message are required." });
    }

    const item = await Item.findById(itemId);
    if (!item) return res.status(404).json({ message: "Item not found." });

    if (item.postedBy.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "You cannot claim your own posted item." });
    }

    if (item.status === "claimed") {
      return res.status(400).json({ message: "This item is already claimed." });
    }

    const alreadyRequested = await Claim.findOne({ item: itemId, requestedBy: req.user._id });
    if (alreadyRequested) {
      return res.status(400).json({ message: "You already sent a claim request for this item." });
    }

    const claim = await Claim.create({ item: itemId, requestedBy: req.user._id, message });
    res.status(201).json({ message: "Claim request sent.", claim });
  } catch (error) {
    res.status(500).json({ message: "Failed to send claim.", error: error.message });
  }
};

exports.getMySentClaims = async (req, res) => {
  try {
    const claims = await Claim.find({ requestedBy: req.user._id })
      .populate({ path: "item", populate: { path: "postedBy", select: "name email" } })
      .sort({ updatedAt: -1 });

    res.json({ claims });
  } catch (error) {
    res.status(500).json({ message: "Failed to get your claims.", error: error.message });
  }
};

exports.getMyReceivedClaims = async (req, res) => {
  try {
    const myItems = await Item.find({ postedBy: req.user._id }).select("_id");
    const itemIds = myItems.map((item) => item._id);

    const claims = await Claim.find({ item: { $in: itemIds } })
      .populate("item")
      .populate("requestedBy", "name email")
      .sort({ createdAt: -1 });

    res.json({ claims });
  } catch (error) {
    res.status(500).json({ message: "Failed to get received claims.", error: error.message });
  }
};

exports.approveClaim = async (req, res) => {
  try {
    const { handoverInstruction } = req.body;

    if (!handoverInstruction || handoverInstruction.trim().length < 5) {
      return res.status(400).json({ message: "Please add clear pickup instructions." });
    }

    const claim = await Claim.findById(req.params.id).populate("item");
    if (!claim) return res.status(404).json({ message: "Claim not found." });

    if (claim.item.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only the item poster can approve this claim." });
    }

    if (claim.item.status === "claimed") {
      return res.status(400).json({ message: "This item is already claimed." });
    }

    claim.status = "approved";
    claim.handoverInstruction = handoverInstruction;
    await claim.save();

    await Item.findByIdAndUpdate(claim.item._id, {
      status: "claimed",
      approvedClaim: claim._id,
    });

    await Claim.updateMany(
      { item: claim.item._id, _id: { $ne: claim._id } },
      { status: "rejected" }
    );

    res.json({ message: "Claim approved and instructions sent.", claim });
  } catch (error) {
    res.status(500).json({ message: "Failed to approve claim.", error: error.message });
  }
};

exports.rejectClaim = async (req, res) => {
  try {
    const claim = await Claim.findById(req.params.id).populate("item");
    if (!claim) return res.status(404).json({ message: "Claim not found." });

    if (claim.item.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only the item poster can reject this claim." });
    }

    claim.status = "rejected";
    await claim.save();

    res.json({ message: "Claim rejected.", claim });
  } catch (error) {
    res.status(500).json({ message: "Failed to reject claim.", error: error.message });
  }
};
