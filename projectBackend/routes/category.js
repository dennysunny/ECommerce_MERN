const express = require("express")
const router = express.Router();

const { isSignedIn, isAuthenticated, isAdmin} = require("../controllers/auth")
const {getUserById} = require("../controllers/user")
const {
    getCategoryById,
    createCategory, 
    getCategory, 
    getAllCategory, 
    updateCategory, 
    removeCategory
} = require("../controllers/category");


router.param("userId", getUserById);
router.param("categoryId", getCategoryById);

//actual routes
router.post(
    "/category/create/:userId", 
    isSignedIn, isAuthenticated, isAdmin, createCategory);

router.get(
    "/category/:categoryId", 
    isSignedIn, isAuthenticated, isAdmin, getCategory);
router.get(
    "/categories/:userId", 
    isSignedIn, isAuthenticated, isAdmin, getAllCategory);

router.put(
    "/category/:categoryId/:userId", 
    isSignedIn, isAuthenticated, isAdmin, updateCategory);

router.delete(
    "/category/:categoryId/:userId", 
    isSignedIn, isAuthenticated, isAdmin, removeCategory);

module.exports = router