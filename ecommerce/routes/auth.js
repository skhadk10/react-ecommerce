const express = require("express");
const router = express.Router();
const { check } = require("express-validator");

const { signup, signin, signout } = require("../controllers/auth");
const {
  userSignUpValidator,
  createValidator,
} = require("../validator/index.js");
//
router.post(
  "/signup",createValidator, userSignUpValidator,
  signup
);
router.post("/signin", signin);
router.get("/signout", signout);

module.exports = router;
