const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");

const User = require("../models/User");

router.post(
  "/",
  [
    body("name", "Name must contain atleast 3 characters").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password must contain atleast 3 characters").isLength({
      min: 5,
    }),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    })
      .then((user) => res.json(user))
      .catch((err) => {
        console.log(err);
        res.json({ error: "Email already in use." });
      });
  }
);

module.exports = router;
