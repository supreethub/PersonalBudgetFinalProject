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
              "Error! Save Minimum of 4 and Maximum of 32 Characters Required in all Fields!"
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

exports.authMiddleware = function (req, res, next) {
  const json_token = req.headers.authorization;
  try {
    if (json_token) {
      const user = parseToken(json_token);
      User.findById(user.userId, function (err, user) {
        if (err) {
          return res.status(422).json({
            error: "Oops! Something went wrong",
          });
        }
        if (user) {
          res.locals.user = user;
          UID = user.id;
          next();
        } else {
          return res.status(422).json({ error: "Not authorized user" });
        }
      });
    } else {
      return res.status(422).json({ error: "Not authorized user!" });
    }
  } catch (err) {
    res.status(403).json({
      success: false,
      message: err,
    });
  }
};

function parseToken(token) {
  return jwt.verify(token.split(" ")[1], env.secret);
}

exports.addBudget = function (req, res) {
  var { title, budgetVal, color } = req.body;
  color += "7f";
  if (!title && !budgetVal && !color) {
    return res
      .status(422)
      .json({ error: "Please provide title, budget, and color" });
  }

  const user1 = UID;
  var amtSpent = 0;
  User.findByIdAndUpdate(
    user1,
    { $push: { budgets: { title, budgetVal, color, amtSpent } } },
    { safe: true, new: true },
    function (err, user) {
      if (err) {
        console.log(err);
      } else {
        return res.status(200).json({ added: true });
      }
    }
  );
};

exports.budgetUsed = function (req, res) {
  var { title, amtSpent } = req.body;
  if (!title || !amtSpent) {
    res.status(422).json({ error: "Please Provide Title or The Amount Spent" });
  }

  User.findById(UID, function (err, user) {
    for (i = 0; i < user.budgets.length; i++) {
      if (user.budgets[i].title === title) {
        console.log(UID)
        console.log(budgID)
        user.budgets[i].amtSpent += amtSpent;
        console.log(user.budgets);
        user.save();
        if (user.budgets[i].amtSpent > user.budgets[i].budgetVal) {
          return res.status(200).json({ updated: true, overBudget: true });
        } else {
          return res.status(200).json({ updated: true, overBudget: false });
        }
      } else {
        console.log(err);
      }
    }
  });
};

exports.getBudget = function (req, res) {
  User.findById(UID, function (err, user) {
    if (err) {
      console.log(err);
    } else {
     // console.log(user.budgets)
      data = user.budgets;
      res.json({ data });
    }
  });
};

