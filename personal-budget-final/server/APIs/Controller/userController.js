const mongoose = require('mongoose');
const User = require('../Schema/schema');
const jwt = require('jsonwebtoken');

//Signup functionality
exports.signup = function (req, res) {
  const { username, email, password, confirmPassword } = req.body;
  if (!email || !password) {
    return res.status(422).json({ error: "Please provide email or password" });
  }

  if (password != confirmPassword) {
    return res.status(422).json({ error: "Password does not match" });
  }
  User.findOne({ email }, function (err, existingUser) {
    if (err) {
      return res.status(422).json({
        error:
          "Error! Minimum of 4 and Maximum of 32 Characters Required in all Fields!",
      });
    }
    if (existingUser) {
      return res.status(422).json({ error: "User already exists" });
    } else {
      const user = new User({
        username,
        email,
        password,
      });
      user.save(function (err) {
        if (err) {
          return res.status(422).json({
            error:
              "Error! Minimum of 4 and Maximum of 32 Characters Required in all Fields!",
          });
        }
        return res.status(200).json({ registered: true });
      });
    }
  });
};

// Login Functionality
exports.login = function (req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(422).json({ error: "Please provide email or password" });
  }
  User.findOne({ email }, function (err, user) {
    if (err) {
      return res.status(422).json({
        error: "Oops! Something Went Wrong",
      });
    }

    if (!user) {
      return res.status(422).json({ error: "Invalid user" });
    }

    if (user.hasSamePassword(password)) {
      json_token = jwt.sign(
        {
          userId: user.id,
          username: user.username,
        },
        env.secret,
        { expiresIn: "1h" }
      );

      return res.json(json_token);
    } else {
      return res.status(422).json({ error: "Wrong email or password" });
    }
  });
};

