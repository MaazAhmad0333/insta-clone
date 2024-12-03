require("dotenv").config();
const express = require("express");
const app = express();
const { db } = require("./connection");
const userRouter = require("./routes/user");
const postRouter = require("./routes/post");
const followerRoute = require("./routes/follower");
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

db.getConnection()
  .then((connection) => {
    console.log("MySQL Connected");
    connection.release(); // Release the connection back to the pool
  })
  .catch((err) => {
    console.error("Error connecting to MySQL:", err);
  });
app.get("/", (req, res) => {
  console.log("Server up!");
  res.status(200).json({ message: "Server up" });
});
app.use("/api/users", userRouter);
app.use("/api/posts", postRouter);
app.use("/api/follow", followerRoute);

app.listen(8000, () => console.log("Server Started"));
