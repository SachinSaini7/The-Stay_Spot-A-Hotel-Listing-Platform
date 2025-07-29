const express=require('express');
const router=express.Router({mergeParams:true});
const wrapAsync=require('../util/wrapAsync');
const {validateReview, isLoggedIn, isAuthor}=require("../middleware.js");
const controllers=require("../controllers/reviews.js");

// Reviews Route
router.post("/",isLoggedIn,validateReview,wrapAsync(controllers.postReview));

// Reviews Delete Route
router.delete("/:reviewId",isLoggedIn,isAuthor,wrapAsync(controllers.destroyReview));

module.exports=router;