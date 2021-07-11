const express = require("express")
const router = express.Router();

const { isSignedIn, isAuthenticated, isAdmin} = require("../controllers/auth")
const {getUserById} = require("../controllers/user");
const {getCategoryById, createCategory, getCategory, getAllCategory} = require("../controllers/category");


router.param("userId", getUserById);
router.param("categoryId", getCategoryById);

//actual routes
router.post("/category/create/:userId", isSignedIn, isAuthenticated, isAdmin, createCategory)
router.post("/category/:categoryId", isSignedIn, isAuthenticated, isAdmin, getCategory)
router.post("/categories", isSignedIn, isAuthenticated, isAdmin, getAllCategory)

module.exports = router