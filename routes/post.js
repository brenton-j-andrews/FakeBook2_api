const router = require('express').Router();

const Post = require("../models/Post");
const User = require('../models/User');

// GET - Get a single post.
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById({ _id : req.params.id });
    res.status(200).json({ post : post });
  }

  catch (error) {
    res.status(500).json({ error : error });
  }
})

// GET - Get user posts for profile page.
router.get("/profile/:username", async (req, res) => {

  
  try {
    let user = await User.findOne({ username : req.params.username })
    let posts = await Post.find({ userId : user._id });
    res.status(200).json(posts);
  }

  catch (error) {
    res.status(500).json({ error : error });
  }
})

// GET - Get current user and friends post for current user timeline page.
router.get("/timeline/:userId", async (req, res) => {

  try {
    const user = await User.findById({ _id : req.params.userId });
    const userPosts = await Post.find({ userId : user._id });


    const friendPosts = await Promise.all(
      user.friends.map((friendId) => {
        return Post.find({ userId : friendId });
      })
    )

    res.status(200).json(userPosts.concat(...friendPosts));
  }

  catch (error) {
    res.status(500).json({ error : error });
  }

})

// POST - Create new post.
router.post("/", async (req, res) => {

  try {
    const newPost = new Post(req.body);
    newPost.save(); 
    res.status(200).json({ "msg" : "Your post has been created." });
  }

  catch (error) {
    res.status(500).json({ error : error });
  }
}) 

// PUT - Update existing post.
router.put("/:id", async (req, res) => {
  console.log(req.body.userId);

  try {
    const post = await Post.findById({ _id : req.params.id });
    console.log(post.userId);

    if (post.userId !== req.body.userId) {
      res.status(403).json({ "msg" : "You cannot modify a post that isn't yours!" });
    }

    else {
      await post.updateOne(req.body);
      res.status(200).json({ "msg" : "Post has been updated." });
    }
  }

  catch (error) {
    console.log(error);
    res.status(500).json({ error : error });
  }
})

// DELETE - Delete existing post.
router.delete("/:id", async (req, res) => {

  console.log(req);

  try {
    const post = await Post.findById({ _id : req.params.id });

    if (post.userId !== req.body.userId) {
      res.status(403).json({ "msg" : "You cannot delete a post that isn't yours!"});
    }

    else {
      await post.deleteOne();
      res.status(200).json({ "msg" : "Your post has been deleted." });
    }
  }

  catch (error) {
    res.status(500).json({ error : error });
  }
})

// PUT - Like or unlike a post.
router.put("/:id/like", async (req, res) => {

  try {
    const post = await Post.findById({ _id : req.params.id });

    if (post.likes.includes(req.body.userId)) {
      await post.updateOne({ $pull : { likes : req.body.userId }});
      res.status(200).json({ "msg" : "Post has been unliked." });
    }
    else {
      await post.updateOne({ $push : { likes : req.body.userId }});
      res.status(200).json({ "msg" : "Post has been liked!" });
    }
  }

  catch (error) {
    res.status(500).json({ error : error });
  }
})


module.exports = router;