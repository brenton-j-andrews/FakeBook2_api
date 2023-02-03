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
      "firstName" : req.body.firstName,
      "lastName" : req.body.lastName,
      "password" : hashedPassword
    })

    const user = await newUser.save();

    res.status(200).json({ user : user});
  }

  // Error handler, specific cases to be added later.
  catch (error) {

    // Email already has a registered account.
    if (error.code === 11000) {
      res.status(409).json({ msg : "This email already has an associated account, please use another."});
    } 

    else {
      res.status(500).json({ error : error });
    }
  }
})

module.exports = router;