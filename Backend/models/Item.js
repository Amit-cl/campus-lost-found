const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    type: { type: String, enum: ["lost", "found"], required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    itemDate: { type: Date, required: true },
    contact: { type: String, required: true },
    imageUrl: { type: String, default: "" },
    imageFileId: { type: String, default: "" },
    status: { type: String, enum: ["open", "claimed"], default: "open" },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    approvedClaim: { type: mongoose.Schema.Types.ObjectId, ref: "Claim", default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Item", itemSchema);
