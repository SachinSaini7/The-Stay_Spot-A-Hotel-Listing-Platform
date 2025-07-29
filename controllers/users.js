const User=require('../models/user.js');

module.exports.renderSignupPage=(req,res)=>{
    res.render("../views/users/signup.ejs");
}

module.exports.signupUser=async(req,res)=>{
    try{
        let {username, email, password}=req.body;
        const newUser=new User({email, username});
        let regUser=await User.register(newUser,password);
        req.flash("success","Signup Successfully, Welcome to Wanderlust!");
        req.login(regUser,(err)=>{
            if(err){
                return next(err);
            }
            res.redirect("/listings");
        })
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
}

module.exports.renderLogin=(req,res)=>{
    res.render("../views/users/login.ejs");
}

module.exports.loginUser=async(req,res)=>{
    req.flash("success","Welcome back to Wanderlust!!");
    let redirectUrl=res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}

module.exports.logoutUser=(req,res)=>{
    req.logOut((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Successfully Logged Out!");
        res.redirect("/listings");
    });
}