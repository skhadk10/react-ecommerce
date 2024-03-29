const { errorHandler } = require("../helper/index.js");
const User = require("../models/user.js");
const jwt = require("jsonwebtoken"); //to generate signed token
const expressJwt = require("express-jwt"); //for authorization  check

exports.signup = (req, res) => {
  const user = new User(req.body);
  user
    .save()
    .then((user) => {
      user.salt = undefined;
      user.hashed_password = undefined;

      res.json({
        message: "User saved successfully",
      });
    })
    .catch((err) => {
      if (user.email === req.body.email) {
        res.json({
          errMsg: "User already exists",
        });
      }
    });
};

exports.signin = (req, res) => {
  // find the user based on email
  const { email, password } = req.body;
  User.findOne({ email })
    .then((User) => {
      // if user is found make sure the email and password match
      // create authenticate method in user model
      if (!User.authenticate(password)) {
        return res
          .status(401)
          .json({ errorMsg: "Email and password does not match" });
      }
      // generate a signed token with user id and secret
      const token = jwt.sign({ _id: User._id }, process.env.JWT_SECRET);
      // persist the token as 't' in cookie with expire date
      res.cookie("t", token, { expire: new Date() + 9999 });
      // return response with user and token to frontend client
      const { _id, name, email, role } = User;
      return res.json({ token, user: { _id, name, email, role } });
    })
    .catch((err) => {
      console.log(User);
      if (err || !User)
        return res
          .status(400)
          .json({ errorMsg: "User with email does not exist. Please signup" });
    });
};

exports.signout = (req, res) => {
  res.clearCookie("t");
  res.json({ message: "Signout success" });
};
