const express = require("express");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const router = express.Router();
const User = require("../models/User");
const fetchUser = require("../middleware/fetchUser");
const JWT_SECRET = "hellothereuser";

// ROUTE 1: Create a user using - POST "/api/auth/createUser"
router.post(
  "/createUser",
  [
    body("name", "Name must contain atleast 3 characters").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password must contain atleast 3 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    // check for invalid user details
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      //Check if user with same email exists
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ error: "A user with this email already exists." });
      }

      // Hashing the password
      const salt = await bcrypt.genSaltSync(10);
      const securePassword = await bcrypt.hashSync(req.body.password, salt);

      //create User
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: securePassword,
      });

      //AuthToken using jsonWebToken
      const data = {
        user: {
          id: user.id,
        },
      };
      const Authtoken = jwt.sign(data, JWT_SECRET);
      res.json({ Authtoken });
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: "Something went wrong!" });
    }
  }
);

// ROUTE 2: Login a user using - POST "/api/auth/login"
router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password cannot be empty").exists(),
  ],
  async (req, res) => {
    // check for invalid user details
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email: email });
      if (!user) {
        return res.status(400).json({ error: "Invalid User credentials" });
      }

      //compare password
      const isSamePassword = await bcrypt.compare(password, user.password);
      if (!isSamePassword) {
        return res.status(400).json({ error: "Invalid User credentials" });
      }

      const data = {
        user: {
          id: user.id,
        },
      };
      const Authtoken = jwt.sign(data, JWT_SECRET);
      res.json({ Authtoken });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ error: "Internal Server error" });
    }
  }
);

// ROUTE 3: Get user details using - POST "/api/auth/getUser"
router.post("/getUser", fetchUser, async (req, res) => {
  try {
    userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Internal Server error" });
  }
});

module.exports = router;
