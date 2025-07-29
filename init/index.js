const mongoose=require('mongoose');
const sampleListings=require('./data.js');
const Listing=require('../models/listing.js');

main()
.then(()=>{
    console.log("Connection Successful");
}).catch((err)=>{
    console.log(err);
})
async function main(){
  await mongoose.connect("mongodb://127.0.0.1:27017/Wanderlust");
}

async function initDb(){
    await Listing.deleteMany({}).then((r)=>{console.log(r)});
    sampleListings.data=sampleListings.data.map((obj)=>({...obj, owner : "6849b6e9e0737ad5a17d5c5f"}));
    await Listing.insertMany(sampleListings.data).then((r)=>{console.log("Data was initialized")});
}

initDb();
