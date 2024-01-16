const express = require("express");
const router = express.Router();

const { userById,read,update } = require("../controllers/user");
const { userSignUpValidator, requireSignin, isAuth, isAdmin } = require("../validator/index.js");
//
router.get('/secret/:userId',requireSignin,isAuth,isAdmin,(req,res)=>{
    res.json({
      user:req.profile
    });
  });
router.get('/user/:userId',requireSignin,isAuth,read)
router.put('/user/:userId',requireSignin,isAuth,update)
// router.get('/hello',userById)
router.param('userId', userById);


module.exports = router;
