const { query } = require("express");
const Listing = require("../models/listing");
const {listingSchema}=require("../schema.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index=async (req, res) => {
  const allListings = await Listing.find({});
  const uniqueLocations = await Listing.distinct("location");
  res.render("listings/index.ejs", { allListings, uniqueLocations });
}

// Add a listing
module.exports.renderNewForm=(req,res)=>{
  res.render("listings/new.ejs");
}

module.exports.postNewForm=async(req,res)=>{
  let response= await geocodingClient
  .forwardGeocode({
    query : req.body.listing.location,
    limit : 1,
  })
  .send();
  let url=req.file.path;
  let filename=req.file.filename;

  const newListing=new Listing(req.body.listing);
  newListing.owner=req.user._id;
  newListing.image={url,filename};
  newListing.geometry=response.body.features[0].geometry;
  newListing.category=req.body.listing.category;
  await newListing.save();
  req.flash("success","New Listing Add!");
  res.redirect("/listings");
}

module.exports.filterByCategory = async (req, res) => {
  const { category } = req.params;
  const allListings = await Listing.find({ category });
  res.render("listings/index.ejs", { allListings });
};

module.exports.searchListing = async (req, res) => {
  const { q } = req.query;
  const allListings = await Listing.find({
    $or: [
      { title: new RegExp(q, "i") },
      { description: new RegExp(q, "i") },
      { location: new RegExp(q, "i") },
      { country: new RegExp(q, "i") },
    ],
  });
  if(allListings.length==0){
    req.flash("error","No listings match your search!");
    return res.redirect("/listings");
  }
  res.render("listings/index.ejs", {allListings});
};

module.exports.showListing= async (req,res)=>{
    const {id}=req.params;
    const listing=await Listing.findById(id).populate({path:"reviews",populate:{path:"author"},}).populate("owner");
    if(!listing){
      req.flash("error","Listing you requested for does not exist!");
      res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
}

module.exports.renderEdit=async (req,res)=>{
  let {id}=req.params;
  const listing=await Listing.findById(id);
  if(!listing){
      req.flash("error","Listing you requested for does not exist!");
      res.redirect("/listings");
    }
  let previewUrl = listing.image.url.replace('/upload', '/upload/ar_1.0,c_mfit,h_150');
  res.render("listings/edit.ejs",{listing,previewUrl});
}

module.exports.editListing=async(req,res)=>{
  let {id}=req.params;
  let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});
  if(typeof req.file !=="undefined"){
    let url=req.file.path;
    let filename=req.file.filename;
    listing.image={url,filename};
    await listing.save();
  }
  req.flash("success","Listing Updated!");
  res.redirect(`/listings/${id}`);
}

module.exports.destroyListing=async(req,res)=>{
  let {id}=req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success","Listing Delete Successfully!");
  res.redirect("/listings");
}
