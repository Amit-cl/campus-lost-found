const express = require("express");
const upload = require("../middleware/upload");
const { protect } = require("../middleware/authMiddleware");
const {
  createItem,
  getItems,
  getItemById,
  getMyItems,
  deleteMyItem,
} = require("../controllers/itemController");

const router = express.Router();

router.get("/", getItems);
router.get("/mine", protect, getMyItems);
router.get("/:id", getItemById);
router.post("/", protect, upload.single("image"), createItem);
router.delete("/:id", protect, deleteMyItem);

module.exports = router;
