const express=require('express');
const router=express.Router();
const wrapAsync = require('../util/wrapAsync.js');
const passport = require('passport');
const {saveRedirect}=require('../middleware.js');
const controllers=require("../controllers/users.js");

// Sign Up Route
router
    .route("/signup")
    .get(controllers.renderSignupPage)
    .post(wrapAsync(controllers.signupUser));


// Login Route
router
    .route("/login")
    .get(controllers.renderLogin)
    .post(saveRedirect,passport.authenticate("local",{failureRedirect:"/login",failureFlash: true}),
controllers.loginUser); 

// Logout
router.get("/logout",controllers.logoutUser);

module.exports=router;