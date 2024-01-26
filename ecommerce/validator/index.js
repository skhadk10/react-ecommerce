const { body, validationResult } = require("express-validator");
var { expressjwt: jwt } = require("express-jwt"); //for authorization  check

exports.createValidator = [
  body("name", "Name is required").not().isEmpty(),
  body("email", "Email is required").isEmail(),
  body("password", "Password is Required").not().isEmpty(),
  body("password", "The minimum password length is 6 characters").isLength({
    min: 6,
  }),
];
exports.signinValidator = [
  body("email", "Email is required").isEmail(),
  body("password", "Password is Required").not().isEmpty(),
  body("password", "The minimum password length is 6 characters").isLength({
    min: 6,
  }),
];

exports.userSignUpValidator = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  res.status(422).json({ error: errors.array() });
};

exports.requireSignin = jwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"], // added later
  userProperty: "auth",
});

exports.isAuth = (req, res, next) => {
  let user = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!user) {
    return res.status(403).json({
      error: "Access denied",
    });
  }
  next();
};

// protect from other user to acces other user id
exports.isAdmin = (req, res, next) => {
  if (req.profile.role === 0) {
    return res.status(403).json({
      error: "Admin resource! Access denied",
    });
  }
  next();
};
