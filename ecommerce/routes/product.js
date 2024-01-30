const express = require("express");
const router = express.Router();

const { userById } = require("../controllers/user.js");
const {
  userSignUpValidator,
  requireSignin,
  isAuth,
  isAdmin,
} = require("../validator/index.js");
const {
  create,
  productById,
  read,
  remove,
  update,
  list,
  listRelated,
  listCategories,
  listBySearch,
  photo,
  listSearch
} = require("../controllers/product.js");
//
router.get("/product/read/:productId", read);
router.post("/product/create/:userId", requireSignin, isAuth, isAdmin, create);
router.delete(
  "/product/:productId/:userId",
  requireSignin,
  isAuth,
  isAdmin,
  remove
);
router.put(
  "/product/:productId/:userId",
  requireSignin,
  isAuth,
  isAdmin,
  update
);
router.get("/product/photo/:productId", photo);
router.get("/products/related/:productId", listRelated);
router.get("/products", list);
router.get("/products/search", listSearch);
router.get("/products/categories", listCategories);
router.post("/products/by/search", listBySearch);
// router.get('/hello',userById)
router.param("userId", userById);
router.param("productId", productById);

module.exports = router;
