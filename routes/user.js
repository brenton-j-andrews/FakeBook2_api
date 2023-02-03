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

module.exports = router;