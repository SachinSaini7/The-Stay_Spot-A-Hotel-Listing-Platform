const express=require('express');
const router=express.Router();
const wrapAsync=require('../util/wrapAsync');
const { isLoggedIn, isOwner,validateListing,} = require('../middleware.js');

const listingController=require("../controllers/listings.js");

const multer=require('multer');
const {storage}=require("../cloudConfig.js");
const upload=multer({storage});

// Index Route
router.get("/", wrapAsync(listingController.index));

// Show listings by category
router.get("/category/:category", wrapAsync(listingController.filterByCategory));
router.get("/location/:location", wrapAsync(listingController.filterByLocation));
router.get("/search", wrapAsync(listingController.searchListing));

// Add New Route
router
    .route("/new")
    .get(isLoggedIn,wrapAsync(listingController.renderNewForm))
    .post(isLoggedIn,upload.single("listing[image]"),validateListing,wrapAsync(listingController.postNewForm));

// View / Delete Route
router
    .route("/:id")
    .get(listingController.showListing)
    .delete(isLoggedIn,isOwner,listingController.destroyListing);

// Update Route
router
    .route("/:id/edit")
    .get(isLoggedIn,isOwner,listingController.renderEdit)
    .put(upload.single("listing[image]"),validateListing,wrapAsync(listingController.editListing));


module.exports=router;