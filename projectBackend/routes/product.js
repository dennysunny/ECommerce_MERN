const express = require("express");
const router = express.Router();

const { getUserById } = require("../controllers/user");
const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");
const {
  getProductById,
  createProduct,
  getProduct,
  photo,
  updateProduct,
  removeProduct,
  getAllProducts,
  getAllUniqueCategories
} = require("../controllers/product");

//P A R A M S
router.param("userId", getUserById);
router.param("productId", getProductById);

//R O U T E S
router.post(
  "/product/create/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  createProduct,
);

router.get("/product/:productId", isSignedIn, getProduct);

router.get("/product/photo/:productId", isSignedIn, photo);

router.put(
  "/product/update/:productId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  updateProduct
);

router.delete(
  "/product/delete/:productId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  removeProduct
);

//L I S T I N G  R O U T E
//like limiting the number of items displayed in a page, onScroll etc
router.get("/products", getAllProducts)

router.get("/product/categories", getAllUniqueCategories)


module.exports = router;
