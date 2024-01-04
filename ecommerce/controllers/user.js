const User = require("../models/user.js");

exports.userById = (req, res, next, id) => {
    // const user=User.findById(id)
  User.findById(id)
    .then((user) => {
      req.profile = user;
      next();
    })
    .catch((err) => {
      if (err) {
        res.status(400).json({ error: "User not found" });
      }
    });
};

