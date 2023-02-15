const router = require('express').Router();
const Message = require("../models/Message");

// POST - Create new message. 
router.post("/", async (req, res) => {

  const newMessage = new Message({
    conversationId : req.body.conversationId,
    sender : req.body.senderId,
    messageContent : req.body.messageContent
  });

  try {
    const savedMessage = await newMessage.save();
    res.status(200).json(savedMessage);
  }

  catch (error) {
    res.status(500).json(error);
  }
})

// GET - Get messages associated with a conversation.
router.get("/:conversationId", async (req, res) => {
  try {
    const response = await Message.find({
      conversationId : req.params.conversationId
    });
    console.log(response);

    res.status(200).json(response);
  }
  catch (error) {
    res.status(500).json(error);
  }
})

module.exports = router;