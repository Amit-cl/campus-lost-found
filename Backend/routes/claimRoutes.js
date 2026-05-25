const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  createClaim,
  getMySentClaims,
  getMyReceivedClaims,
  approveClaim,
  rejectClaim,
} = require("../controllers/claimController");

const router = express.Router();

router.post("/", protect, createClaim);
router.get("/mine", protect, getMySentClaims);
router.get("/received", protect, getMyReceivedClaims);
router.patch("/:id/approve", protect, approveClaim);
router.patch("/:id/reject", protect, rejectClaim);

module.exports = router;
