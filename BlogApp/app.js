var express = require("express"),
  app = express(),
  methodOverride = require("method-override"),
  expressSantizer = require("express-sanitizer"),
  mongoose = require("mongoose"),
  flash = require("connect-flash"),
  passport = require("passport"),
  LocalStrategy = require("passport-local"),
  bodyParser = require("body-parser"),
  Blog = require("./models/blog"),
  Comment = require("./models/comments"),
  User = require("./models/user");

var blogRoutes = require("./routes/blogs"),
  indexRoutes = require("./routes/index");

mongoose.connect("mongodb://mongo:27017/expressmongo", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
}).then(() => console.log("MongoDB Connected")).catch(err => console.log(err));

app.set("view engine", "ejs");

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSantizer());
app.use(methodOverride("_method"));

app.use(flash());

app.locals.moment = require("moment");

//Passport Configuration
app.use(
  require("express-session")({
    secret: "I am the best",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

app.use(indexRoutes);
app.use(blogRoutes);
//app.use(commentRoutes);

app.listen(3000, () => {
  console.log("Blog App Serving at Port 3000 !");
});
