const express = require("express");
const router = express.Router();

const { userById } = require("../controllers/user.js");
const { userSignUpValidator, requireSignin, isAuth, isAdmin } = require("../validator/index.js");
const { create } = require("../controllers/product.js");
//
router.post('/product/create/:userId',requireSignin,create);
// router.get('/hello',userById)
router.param('userId', userById);


module.exports = router;
