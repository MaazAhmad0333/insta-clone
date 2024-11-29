const express = require("express");
const router = express.Router();
const {
  handleGetAllUsers,
  handleRegister,
  handleLoginUser,
  handleUpdateUserById,
  handleGetUserById,
} = require("../controllers/userContoller");
const authenticateToken = require("../middlewares/authMiddleware");
const { upload } = require("../middlewares/multerMiddleware");

// Register User
router.post("/register", upload.single("profile_picture"), handleRegister);

// Login User
router.post("/login", handleLoginUser);

// Get All users
router.get("/", authenticateToken, handleGetAllUsers);

// Get user bt id
router.get("/:id", handleGetUserById);

//  Update User By Id
router.patch("/update/:id", handleUpdateUserById);

module.exports = router;
