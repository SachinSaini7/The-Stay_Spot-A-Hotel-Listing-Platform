if(process.env.NODE_ENV != "production"){
require('dotenv').config();
}
const express=require('express');
const app=express();
const mongoose=require('mongoose');
const methodOverride=require('method-override');
const path=require('path');
const ejsMate=require('ejs-mate');
const ExpressError=require('./util/ExpressError');
const session=require('express-session');
const MongoStore=require("connect-mongo");
const flash=require('connect-flash');
const passport=require('passport');
const LocalStrategy=require('passport-local');
const User=require("./models/user.js");
const {isLoggedIn}=require('./middleware.js');


const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.json());

// const localDbUrl="mongodb://127.0.0.1:27017/Wanderlust";
const dbUrl=process.env.ATLASDB_URL;

// Database Connection

async function main() {
  try {
    await mongoose.connect(dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      ssl: true,
      tlsAllowInvalidCertificates: false, 
    });
    console.log("✅ MongoDB connection established successfully");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
  }
}

main();

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET
  },
  touchAfter: 24 * 3600 // 1 day
});

store.on("error",()=>{
  console.log("Error in Mongo Session Store");
});

const sessionOptions={
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized:true,
  cookie:{
    expires:Date.now()+7*24*60*60*1000,
    maxAge:7*24*60*60*1000,
    httpOnly:true,
  }
}

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  res.locals.currUser=req.user;
  next();
})

// Routing

app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);

app.get("/", (req, res) => {
  res.redirect("/listings");
});

// For all another routes
app.all("*",(req,res,next)=>{
  next(new ExpressError(404,"Page not found!"));
});

// AsyncFn Error Handler
app.use((err,req,res,next)=>{
  let {statusCode=500,message="Something went wrong!"}=err;
  res.status(statusCode).render("listings/error.ejs",{err});
});


// Node Server 
app.listen(8080,(req,res)=>{
    console.log("listening to port 8080");
})

