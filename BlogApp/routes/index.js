var express  = require("express"),
    router   = express.Router(),
    passport = require("passport"),
    User     = require("../models/user");

// ============
//Authentication Routes
//=============

router.get("/", function(req,res){
    res.render("landing");
    });

router.get("/register",function(req,res){
    res.render("register");
});

//handle Signup

router.post("/register", function(req,res){
    var newUser = new User({username:req.body.username});
    User.register(newUser, req.body.password,function(err,user){
        if(err){
            req.flash("error",err.message);
            res.redirect("/register");
        }
        passport.authenticate("local")(req,res, function(){
            req.flash("success","Welcome to BlogApp "+user.username);
            res.redirect("/blogs");
        });
    });

});

//Show Login Form
router.get("/login", function(req,res){
    res.render("login");
});

//Handle Login Logic

router.post("/login", function(req, res, next){
    passport.authenticate("local", 
    {   
        successRedirect:"/blogs",
        failureRedirect:"login",
        successFlash: "Welcome back " + req.body.username + " !",
        failureFlash:"Please check your Username or Password again !"
    })(req, res);
}) ;

//Logout Route

router.get("/logout",function(req,res){
    req.logOut();
    req.flash("success","Logged you out!")
    res.redirect("/blogs");
});

module.exports = router;