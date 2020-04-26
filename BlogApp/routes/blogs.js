var express    = require("express"),
    router     = express.Router(),
    middleware = require("../middleware"),
    Blog       = require("../models/blog").default;



//Displays all the blogs on the Index Page
router.get("/blogs",function(req,res){
    Blog.find({}, function(err, blogs){
        if(err){
            console.log(err);
        }
        else{
            res.render("blogs/index", {blogs: blogs});
        }
    });
});

//Creates and Posts New Blog on the Index Page after taking input from the Form
router.post("/blogs",middleware.isLoggedIn, function(req,res){
    var title = req.body.title;
    var image = req.body.image;
    var description= req.body.description;
    var author ={
        id:req.user._id,
        username:req.user.username
    }

    var newBlog={title: title, image:image,description:description,author:author};

    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(newBlog, function(err,newlyCreated){
        if(err){
            console.log(err);
        }
        else{
            res.redirect("/blogs");
        }
    });
});

//Renders The Form Page to Create new Blog
router.get("/blogs/new",middleware.isLoggedIn,function(req,res){

    res.render("blogs/new");
});



//Renders the More Info Page about a Blog on Clicking
router.get("/blogs/:id", function(req,res){

    Blog.findById(req.params.id,function(err, foundBlog){
        if(err){
            console.log(err);
        }
        else{
            res.render("blogs/show",{blog:foundBlog});
        }
    });
});

//Edit Route- Combination of the form and Create
router.get("/blogs/:id/edit",middleware.checkBlogOwnership,function(req,res){
    Blog.findById(req.params.id, function(err,foundBlog){
        if(err){
            console.log(err);
        }
        else{
            res.render("blogs/edit",{blog:foundBlog});
        }
    });
});



//Update Route

router.put("/blogs/:id",middleware.checkBlogOwnership, function(req,res){

    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedBlog){
        if(err){
            console.log(err);
        }
        else{
            res.redirect("/blogs/" + req.params.id);
        }

    });
});
//DELETE ROUTE
router.delete("/blogs/:id",middleware.checkBlogOwnership, function(req, res) {
    Blog.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            console.log(err);
        }
        else {
            res.redirect("/blogs");
        }
    });
});

module.exports = router;