const { body, validationResult } = require("express-validator");
var { expressjwt: jwt } = require("express-jwt"); //for authorization  check

// exports.userSignUpValidator = (req, res, next) => {
//   body("name", "Name is required").notEmpty();

//   body("email", "Email must be between 3 to 32 characters")
//     .matches(/.+\@.+\..+/)
//     .withMessage("Email must contain @")
//     .isLength({
//       min: 4,
//       max: 32,
//     });
//   body("password", "Password is required").notEmpty();

//   body("password")
//     .isLength({ min: 6 })
//     .withMessage("Password must be contain at least 6 characters")
//     .matches(/\d/)
//     .withMessage("Password must contain a number");
//   const errors = validationResult(req);
//   console.log(validationResult(req),"checking validation")
//   if (errors.isEmpty()) {
//     return next();
//   }
//   errors.array().map((err) => extractedErrors.push({ [err.path]: err.msg }));

//   return res.status(422).json({
//     errors: extractedErrors,
//   });
// };


exports.createValidator = [
  body("name", "Name is required").not().isEmpty(),
  body("email", "Email is required").isEmail(),
  body("password", "Password is Required").not().isEmpty(),
  body("password", "The minimum password length is 6 characters").isLength(
    { min: 6 }
  ),
];

exports.userSignUpValidator = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    // in case request params meet the validation criteria
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

// const { body, validationResult } = require("express-validator");
// const userValidationRules = () => {
//   return [
//     // username must be an email
//     body("username").isEmail(),
//     // password must be at least 5 chars long
//     body("password").isLength({ min: 5 }),
//   ];
// };

// const validate = (req, res, next) => {
//   const errors = validationResult(req);
//   if (errors.isEmpty()) {
//     return next();
//   }
//   const extractedErrors = [];
//   errors.array().map((err) => extractedErrors.push({ [err.param]: err.msg }));

//   return res.status(422).json({
//     errors: extractedErrors,
//   });
// };

// module.exports = {
//   userValidationRules,
//   validate,
// };
