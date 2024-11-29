const express = require("express");
const router = express.Router();
const {
  handleFollowUser,
  handleUnfollowUser,
} = require("../controllers/followerController");
const authenticateToken = require("../middlewares/authMiddleware");

router.use(authenticateToken);

router.post("/following", handleFollowUser);

router.post("/unfollowed", handleUnfollowUser);

module.exports = router;
