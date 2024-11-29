const express = require("express");
const router = express.Router();
const {
  handleCreatePost,
  handleGetAllPosts,
  handleUpdatePost,
} = require("../controllers/postController");
const authenticateToken = require("../middlewares/authMiddleware");

// Auth Middleware
router.use(authenticateToken);

// Get All posts
router.get("/", handleGetAllPosts);

// Create New Post
router.post("/create", handleCreatePost);

// Get Post by id
// router.get('/:id', handleGetPostById);

//  Update Post By Id
router.patch("/update/:id", handleUpdatePost);

module.exports = router;
