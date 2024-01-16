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

exports.read = (req, res) => {
  req.profile.hashed_password = undefined;
  req.profile.salt = undefined;
  return res.json(req.profile);
};

exports.update = (req, res) => {
  User.findOneAndUpdate({ _id: req.profile._id }, { $set: req.body }, { new: true })
    .then((user) => {
      user.hashed_password = undefined;
      user.salt = undefined;
      res.json(user);
      
    })
    .catch((err) => {
      if (err) {
        res.status(400).json({ error: "YOu are not authorized to perform this action" });
      }
    });
};
