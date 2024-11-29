const { db } = require("../connection");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//  Get All Users
async function handleGetAllUsers(req, res) {
  const [rows] = await db.query("SELECT * FROM users");
  return res.json(rows);
}

// Create New User
async function handleRegister(req, res) {
  const { username, email, password, profile_picture, bio } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ msg: "All fields are required" });
  }

  try {
    // Check if user already exists
    const [existingUsers] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    if (existingUsers.length > 0) {
      return res
        .status(400)
        .json({ msg: "User already exists with this email" });
    }

    // Hash the password
    const myEncPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the database
    const [result] = await db.query(
      "INSERT INTO users (username, email, password, profile_picture, bio) VALUES (?, ?, ?, ?, ?)",
      [username, email, myEncPassword, profile_picture, bio]
    );

    // Get the newly created user's ID
    const newUserId = result.insertId;

    // Fetch the newly created user for the response
    const [newUserRows] = await db.query("SELECT * FROM users WHERE id = ?", [
      newUserId,
    ]);
    const newUser = newUserRows[0];

    return res.json({ msg: "Account Created", user: newUser });
  } catch (error) {
    console.error("Error during user signup:", error);
    return res.status(500).json({ msg: "Internal server error" });
  }
}

// Login User
async function handleLoginUser(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ msg: "Email and Password required" });
  }

  const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
  const user = rows[0];

  if (!user) {
    return res.status(400).json({ msg: "No client found with this email" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (isPasswordValid) {
    //Generate Jwt Token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(200).json({ success: true, token });
  } else {
    return res.status(400).json({ msg: "Invalid email or password" });
  }
}

// Update User By Id
async function handleUpdateUserById(req, res) {
  const [result] = await db.query("UPDATE users SET ? WHERE id = ?", [
    req.body,
    req.params.id,
  ]);
  console.log(result);
  if (result.affectedRows === 0) {
    return res.status(404).json({ msg: "User not found" });
  }

  const [updatedUser] = await db.query("SELECT * FROM users WHERE id = ?", [
    req.params.id,
  ]);
  return res.json({ msg: "User Info Updated", updatedinfo: updatedUser[0] });
}

// Get user By Id
async function handleGetUserById(req, res) {
  const [result] = await db.query("SELECT * FROM users WHERE id = ?", [
    req.params.id,
  ]);
  return res.json(result);
}

module.exports = {
  handleGetAllUsers,
  handleRegister,
  handleLoginUser,
  handleUpdateUserById,
  handleGetUserById,
};
