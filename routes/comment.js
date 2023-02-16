const router = require('express').Router();
const Comment = require("../models/Comment");

// POST - Create new comment.
router.post("/", async (req, res) => {
  const newComment = new Comment(req.body);

  try {
    let response = await newComment.save();
    res.status(200).json(response);
  }
  catch (error) {
    res.status(500).json(error);
  }
})

// GET - Get comments associated with post.
router.get("/:postId", async (req, res) => {

  try {
    let response = await Comment.find({ postId : req.params.postId });
    res.status(200).json(response);
  }

  catch (error) {
    res.status(500).json(error);
  }
})

// DELETE - Delete a comment.
router.delete("/:id", async (req, res) => {
  console.log(req.body);
  try {
    let comment = await Comment.findById(req.params.id);

    if (comment.commenterId !== req.body.userId) {
      res.status(403).json({ "msg" : "You cannot delete a comment that isn't yours!"});
    }
    else {
      await comment.delete();
      res.status(200).json({ "msg" : "comment deleted" });
    }

  }
  catch (error) {
    res.status(500).json(error);
  }
})

// PUT - Like or unlike a comment.

module.exports = router;