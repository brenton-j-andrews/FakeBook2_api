const router = require('express').Router();
const Conversation = require("../models/Conversation");

// POST - Create new conversation.
router.post("/", async (req, res) => {
  const newConversation = new Conversation({
    members : [ req.body.senderId, req.body.recipientId ]
  })

  try {
    const savedConversation = await newConversation.save();
    res.status(200).json(savedConversation);
  }

  catch (error) {
    res.status(500).json(error);
  }
})

// GET - Get conversations of current user.
router.get("/:userId", async (req, res) => {
  try {
    const conversations = await Conversation.find({
      members : { $in : [req.params.userId] }
    })

    console.log(conversations);
    res.status(200).json(conversations);
  }
  catch (error) {
    res.status(500).json(error);  
  }
})

module.exports = router;