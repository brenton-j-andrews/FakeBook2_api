const router = require("express").Router();
const bcrypt = require("bcrypt");

const User = require("../models/User");

// POST - Register new user.
router.post("/register", async (req, res) => {

  console.log(req.body);
  
  try {
    // Hash password input.
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const newUser = new User({
      "email" : req.body.email,
      "username" : req.body.username,
      "firstName" : req.body.firstName,
      "lastName" : req.body.lastName,
      "password" : hashedPassword
    })

    const user = await newUser.save();

    res.status(200).json({ user : user});
  }

  // Error handler, specific cases to be added later.
  catch (error) {
    console.log(error);

    // Email already has a registered account.
    if (error.code === 11000) {
      res.status(409).json({ msg : "This email already has an associated account, please use another."});
    } 

    else {
      res.status(500).json({ error : error });
    }
  }
})

// POST - Sign in user.
router.post("/login", async (req, res) => {

  try {
    // Check that email is valid.
    const user = await User.findOne({ email : req.body.email }).populate('friends', "_id username firstName lastName profileImageUrl");
    
    if (!user) {
      res.status(404).json({ msg: "Account not found." });
    }

    else {
      const validPassword = await bcrypt.compare(req.body.password, user.password);

      if (!validPassword) {
        res.status(400).json({ msg: "Incorrect Password" });
      }
      else {
        res.status(200).json(user);
      }
    }
  }

  catch (error) {
    res.status(500).json(error);
  }
})

module.exports = router;