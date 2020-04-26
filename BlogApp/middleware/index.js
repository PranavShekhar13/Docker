var middlewareObj ={};

var Blog = require("../models/blog").default;


middlewareObj.isLoggedIn = function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    else{
        req.flash("error","Please Login First !");
        res.redirect("/login");
    }
}

middlewareObj.checkBlogOwnership = function(req,res,next){
    if(req.isAuthenticated()){   //checks for user log in then only proceed
        Blog.findById(req.params.id, function(err,foundBlog){
            if(err){
                req.flash("error","Campgrfound Not Found !")
                res.redirect("back");
            }
            else{
                if(foundBlog.author.id.equals(req.user._id)) {  //checks for the logged in user to be creator of the campground then only edit
                next();
                }
                else{
                   req.flash("error", "You don't have the permiision to do that");
                   res.redirect("back"); 
                }
            }
        });

    }
    else{
        req.flash("error", "Please Login First!");
        res.redirect("back");
    }
}

module.exports = middlewareObj;