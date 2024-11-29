const { db } = require("../connection");

//Follow a user
async function handleFollowUser(req, res) {
  // console.log("🚀 ~ handleFollowUser ~ req:", req.user.id);
  try {
    const { following_id } = req.body; // User to follow (the one being followed)
    // const  follower_id = req.user.id; // Current logged-in user (the one who follows)
    console.log("req.user.id:", req.user.id, "Type:", typeof req.user.id);
    console.log("following_id:", following_id, "Type:", typeof following_id);

    if (!following_id) {
      return res.status(400).json({ msg: "Following user ID is required" });
    }

    if (req.user.id === Number(following_id)) {
      return res.status(400).json({ msg: "You can not follow yourself" });
    }

    const [existingFollow] = await db.query(
      "SELECT * FROM followers WHERE follower_id = ? AND following_id = ?",
      [req.user.id, following_id]
    );
    if (existingFollow.length > 0) {
      return res
        .status(400)
        .json({ msg: "You are already following this user" });
    }

    //Create follow record
    await db.query(
      "INSERT INTO followers (follower_id, following_id) VALUES (?,?)",
      [req.user.id, following_id]
    );
    return res.status(200).json({ msg: "You are now following this user" });
  } catch (error) {
    console.log("🚀 ~ handleFollowUser ~ error:", error);
    return res.status(500).json({ msg: "Internal server error" });
  }
}

//Unfollow user
async function handleUnfollowUser(req, res) {
  try {
    const { following_id } = req.body; // User to unfollow
    const follower_id = req.user.id; // currently logged user

    if (!following_id) {
      return res.status(400).json({ msg: "Following user ID is required" });
    }

    const [existingFollow] = await db.query(
      "SELECT * FROM followers WHERE following_id = ? AND follower_id = ?",
      [following_id, follower_id]
    );
    if (existingFollow.length === 0) {
      return res.json({ msg: "You are not following this user" });
    }

    await db.query(
      "DELETE FROM followers WHERE following_id = ? AND follower_id = ?",
      [following_id, follower_id]
    );

    return res.status(200).json({ msg: "Successfully unfollowed" });
  } catch (error) {
    console.log("🚀 ~ handleUnfollowUser ~ error:", error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
}

module.exports = {
  handleFollowUser,
  handleUnfollowUser,
};

// Follow a user
// async function handleFollowUser(req, res) {
//   const { following_id } = req.body; // User to follow (the one being followed)
//   const follower_id = req.user.id; // Current logged-in user (the one who follows)

//   if (!following_id) {
//     return res.status(400).json({ msg: "Following user ID is required" });
//   }

//   try {
//     // Check if the user is trying to follow themselves
//     if (follower_id === following_id) {
//       return res.status(400).json({ msg: "You cannot follow yourself" });
//     }

//     // Check if the follow relationship already exists
//     const [existingFollow] = await db.query(
//       "SELECT * FROM followers WHERE follower_id = ? AND following_id = ?",
//       [follower_id, following_id]
//     );
//     if (existingFollow.length > 0) {
//       return res
//         .status(400)
//         .json({ msg: "You are already following this user" });
//     }

//     // Create follow record
//     await db.query(
//       "INSERT INTO followers (follower_id, following_id) VALUES (?, ?)",
//       [follower_id, following_id]
//     );

//     return res.json({ msg: "You are now following this user" });
//   } catch (error) {
//     console.error("Error following user:", error);
//     return res.status(500).json({ msg: "Internal server error" });
//   }
// }

// Unfollow a user
// async function handleUnfollowUser(req, res) {
//   const { following_id } = req.body; // User to unfollow
//   const follower_id = req.user.id; // Current logged-in user (the one who unfollows)

//   if (!following_id) {
//       return res.status(400).json({ msg: "Following user ID is required" });
//   }

//   try {
//       // Check if the follow relationship exists
//       const [existingFollow] = await db.query('SELECT * FROM followers WHERE follower_id = ? AND following_id = ?', [follower_id, following_id]);
//       if (existingFollow.length === 0) {
//           return res.status(400).json({ msg: "You are not following this user" });
//       }

//       // Delete the follow relationship
//       await db.query('DELETE FROM followers WHERE follower_id = ? AND following_id = ?', [follower_id, following_id]);

//       return res.json({ msg: "You have unfollowed this user" });
//   } catch (error) {
//       console.error('Error unfollowing user:', error);
//       return res.status(500).json({ msg: "Internal server error" });
//   }
// }

// Get followers of a user
// async function handleGetFollowers(req, res) {
//   const { id } = req.params; // The user whose followers we want to retrieve

//   try {
//       // Query to get the users who are following this user
//       const [followers] = await db.query(`
//           SELECT u.id, u.username, u.email, u.profile_picture
//           FROM followers f
//           JOIN users u ON f.follower_id = u.id
//           WHERE f.following_id = ?
//       `, [id]);

//       return res.json({ followers });
//   } catch (error) {
//       console.error('Error fetching followers:', error);
//       return res.status(500).json({ msg: "Internal server error" });
//   }
// }

// Get users a user is following
// async function handleGetFollowing(req, res) {
//   const { id } = req.params; // The user whose following list we want to retrieve

//   try {
//       // Query to get the users that this user is following
//       const [following] = await db.query(`
//           SELECT u.id, u.username, u.email, u.profile_picture
//           FROM followers f
//           JOIN users u ON f.following_id = u.id
//           WHERE f.follower_id = ?
//       `, [id]);

//       return res.json({ following });
//   } catch (error) {
//       console.error('Error fetching following:', error);
//       return res.status(500).json({ msg: "Internal server error" });
//   }
// }
