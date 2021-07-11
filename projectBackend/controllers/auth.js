const User = require("../models/user")
const { check, validationResult } = require('express-validator');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt'); 

exports.signup =  (req, res) => {

  //validator check, from auth route, since we are validationg  in the route, if there is errors, that should be present in the req
  //check last code snippet in express validator documentation, for error structure
  const errors = validationResult(req)

  if(!errors.isEmpty()){
    return res.status(422).json({
      parameter : errors.array()[0].param,
      error : errors.array()[0].param + " " + errors.array()[0].msg
    })
  }

  const user = new User(req.body);

  user.save((err, data) => {
      
    if(err){
      return res.status(400).json({
        message : "Not able to save user in DB",
        //error : err.errmsg,
        error: err.message
      })
    }

    //send back saved user from db
    res.json({
      name: user.name,
      email: user.email,
      id: user._id
    }) 
  });
  
}

exports.signin = (req, res) => {
  const {email, password} = req.body; //destructuring

  const errors = validationResult(req)

  if(!errors.isEmpty()){
    return res.status(422).json({
      parameter : errors.array()[0].param,
      error : errors.array()[0].param + " " + errors.array()[0].msg
    })
  }

  //find exactly one match from the db
  User.findOne({email}, (err, user) => {

    if(err ){
      return res.status(400).json({
        error : "Error Getting Data from DB"
      })
    }

    // when invalid email is given
    if(!user){
      return res.status(400).json({
        error : "User Email Doesn't Exists"
      })
    }

    //calling authenticate method in schema
    if(!user.authenticate(password)){
      return res.status(401).json({
        error : "Email and Password do not match"
      })
    }

    // to SIGN IN the user, create a token, put that into cookies
    //check tokens.txt
    const token = jwt.sign({_id : user._id}, process.env.SECRET)

    //put this token to users cookie
    // this is mostly a key value pair
    res.cookie("token", token, {expire: new Date() + 9999})

    //response to frontend
    const {_id, name, email, role} = user
    return res.json({
      token, 
      user : {_id, name, email, role}
    })

  })  

}


exports.signout =  (req, res) => {
  
  res.clearCookie("token");
  res.json({
    message : "User Signout Sucessfully"
  })

}


//P R O T E C T E D   R O U T E S
//eventhough it is a middleware, the reason for not using next() is that, expressjwt already has it
exports.isSignedIn = expressJwt({
  secret : process.env.SECRET,
  userProperty : "auth", // adds a userProperty on req
})

//C U S T O M   M I D D L E W A R E S
exports.isAuthenticated = (req, res, next) => {

  //through the front end - property profile and is available only if user is signed in
  //checking authentication, id from profile, from front end is sane as id from auth - isSignedIn(), 
  let checker = req.profile && req.auth && req.profile._id == req.auth._id

  /* 
  output of req,auth:
   {
    "_id": "60e9a189982b962f905ff111",
    "iat": 1625936838
    }
    here _id (user id) is matched with the token to validate authentication
  */

    if(!checker){
      return res.status(403).json({
        error : "Access Denied"
      })
    }

    next();
}

exports.isAdmin = (req, res, next) => {

  //role is set from front end
  if(req.profile.role === 0){
    return res.status(403).json({
      error : "You're Not an Admin; Access Denied"
    })
  }

  next();
}