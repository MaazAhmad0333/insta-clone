const {db} = require('../connection');


//  Get All Posts
async function handleGetAllPosts(req, res){
    const [rows] = await db.query('SELECT * FROM posts WHERE user_id = ?', [req.user.id]);
    return res.json(rows);
}


async function handleCreatePost(req, res) {
        
        const { image_url, caption } = req.body;

        if (!image_url || !caption) {
            return res.status(400).json({ msg: "All fields are required" });
        }
        const [result] = await db.query('INSERT INTO posts (image_url, caption, user_id) VALUES (?, ?, ?)', [image_url, caption , req.user.id]);
        return res.json({ msg: "Post Created Successfully", id: result.insertId });
    }


async function handleUpdatePost(req, res){
    const [result] = await db.query('UPDATE posts SET WHERE id = ? AND user_id = ?', [req.body, req.params.id ,req.user.id]);
    if(result.affectedRows === 0){
        return res.status(404).json({ msg: "Post not found" });
    }

    const [updatedPost] = await db.query('SELECT * FROM posts WHERE id = ?', [req.params.id]);
    return res.json({msg: "Post Info Updated", updatedInfo: updatedPost[0]});
}

module.exports = {handleGetAllPosts, handleCreatePost, handleUpdatePost};

