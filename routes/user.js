const router = require('express').Router();

const { json } = require('express/lib/response');
const User = require("../models/User");

// GET - Single user document.
router.get("/:id", async (req, res) => {

  try {
    const user = await User.findById({ _id : req.params.id }, { password: 0, createdAt: 0, updatedAt: 0});
    
    if (!user) {
      res.status(400).json({ msg : "User not found."});
    }
    
    else {
      res.status(200).json({ user: user });
    }
  }

  catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
})

// DELETE - Delete existing account.
router.delete("/:id", async (req, res) => {

  // Confirm that account owner is perfoming the action.
  if (req.body.userId === req.params.id) {
    try {
      const user = await User.deleteOne({ _id : req.params.id });
      console.log(user);
      res.status(200).json({ msg : "Your account has been successfully deleted." });
    }

    catch (error) {
      res.status(500).json({ error : error });
    }
  }

  else {
    res.status(403).json({ msg : "You cannot delete an account which is not yours!" });
  }
})

// PUT - Send Friend Request to another account.
router.put("/:id/send_request", async (req, res) => {

  if (req.params.id !== req.body.userId) {

    try {
      const recipient = await User.findById({ _id : req.params.id });
      const signedInUser = await User.findById({ _id : req.body.userId });

      if (recipient.friends.includes(req.body.id)) {
        res.status(403).json({ "msg" : "You are already friends with this user." });
      }
      else if (recipient.receivedFriendRequests.includes(req.body.userId)) {
        res.status(403).json({ "msg" : "You have already sent this user a friend request." });
      }
      else {
        await recipient.updateOne({ $push : { receivedFriendRequests : req.body.userId }});
        await signedInUser.updateOne({ $push : { sentFriendRequests : req.params.id }});

        res.status(200).json({ "msg" : "Friend request sent." });
      }
    }

    catch (error) {
      console.log(error);
      res.status(500).json({ error : error });
    }
  }

  else {
    res.status(403).json({ "msg" : "You cannot add yourself as a friend." });
  }
})

// PUT - Accept Friend Request. 
router.put("/:id/accept_request", async (req, res) => {

  if (req.params.id !== req.body.userId) {

    try {
      const sender = await User.findById({ _id : req.params.id });
      const signedInUser = await User.findById({ _id : req.body.userId });

      if (!signedInUser.receivedFriendRequests.includes(req.params.id)) {
        res.status(403).json({ "msg" : "You haven't received a friend request from this account." });
      }
      else {
        await sender.updateOne({ 
          $push : { friends : req.body.userId }, 
          $pull : { sentFriendRequests : req.body.userId }
        });
  
        await signedInUser.updateOne({
          $push : { friends : req.params.id }, 
          $pull : { receivedFriendRequests : req.params.id }
        });
  
        res.status(200).json({ "msg" : `You are now friends with ${sender.firstName}!`});
      }
    }

    catch (error) {
      console.log(error);
      res.status(500).json({ error : error });
    }
  }

  else {
    res.status(403).json({ "msg" : "You cannot add yourself as a friend." });
  }
})

// Put - Decline Friend Request.
router.put("/:id/decline_request", async (req, res) => {

  if (req.params.id !== req.body.userId) {

    try {
      const sender = await User.findById({ _id : req.params.id });
      const signedInUser = await User.findById({ _id : req.body.userId });

      await sender.updateOne({ 
        $pull : { sentFriendRequests : req.body.userId }
      });

      await signedInUser.updateOne({
        $pull : { receivedFriendRequests : req.params.id }
      });

      res.status(200).json({ "msg" : "Friend request denied."});
    }

    catch (error) {
      console.log(error);
      res.status(500).json({ error : error });
    }
  }

  else {
    res.status(403).json({ "msg" : "You cannot unfriend yourself!" });
  }
})

// PUT - Unfriend User.
router.put("/:id/unfriend", async (req, res) => {
  if (req.params.id !== req.body.userId) {

    try {
      const unfriendedUser = await User.findById({ _id : req.params.id });
      const signedInUser = await User.findById({ _id : req.body.userId });

      await unfriendedUser.updateOne({ 
        $pull : { friends : req.body.userId }
      });

      await signedInUser.updateOne({
        $pull : { friends : req.params.id }
      });

      res.status(200).json({ "msg" : `You are no longer friends with ${unfriendedUser.firstName}`});
    }

    catch (error) {
      console.log(error);
      res.status(500).json({ error : error });
    }
  }

  else {
    res.status(403).json({ "msg" : "You cannot unfriend yourself!" });
  }
})

module.exports = router;