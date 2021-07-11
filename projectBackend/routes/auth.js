const express = require("express")
const router = express.Router()
const { check } = require('express-validator');
const {signup, signin, signout, isSignedIn} = require("../controllers/auth")

//https://express-validator.github.io/docs/

router.post("/signup",
    check('name')
        .isLength({ min: 3 })
        .withMessage('must be at least 3 chars long'),

    check('email')
        .isEmail()
        .withMessage('email is required'),

    check('password')
        .isLength({ min: 4 })
        .withMessage('must be at least 8 chars long'), signup)


router.post("/signin",
    check('email')
        .isEmail()
        .withMessage('email is required'),
    
    check('password')
        .isLength({ min: 4 })
        .withMessage('must be at least 8 chars long'), signin)

router.get("/signout", signout)

router.get("/testroute", isSignedIn, (req, res) => {
    //res.json(req.auth)
})



module.exports = router;