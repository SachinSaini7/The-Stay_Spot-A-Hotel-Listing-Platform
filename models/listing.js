const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review=require("./review");
const User=require("./user");

const listingSchema = new Schema({
  title: {
    type: String,
    required : true,
  },
  description: String,
  image: {
    url: String,
    filename: String,
  },
  price: Number,
  location: String,
  country: String,
  reviews: [
    {
    type : mongoose.Schema.Types.ObjectId,
    ref:"Review",
    },
],
  owner: {
    type : mongoose.Schema.Types.ObjectId,
    ref : "User",
  },
    geometry: {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      // required: true
    },
    coordinates: {
      type: [Number],
      // required: true
    }
  },
    category: {
      type: String,
    },
  
});

listingSchema.post("findOneAndDelete",async(listing)=>{
  if(listing){
    await Review.deleteMany({_id:{$in:listing.reviews}});
  }
  console.log("All data delete");
})

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
