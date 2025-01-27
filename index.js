if(process.env.NODE_ENV!="production"){
  require("dotenv").config()
}
Passport=require('passport')
const multer  = require('multer')
const {storage}=require("./cloudconfig")
const upload = multer({ storage })

const review = require('./models/review');
session=require('express-session')
const MongoStore = require('connect-mongo');  
flash=require('connect-flash')
methodoverride=require('method-override');
express=require('express');
Localstrategoy=require('passport-local')
User=require('./models/user')
app=express();
store=MongoStore.create({
  mongoUrl:process.env.ATLAS_URL,
  crypto:{
    secret:process.env.SECRET
  },
  touchAfter:86400,
})
store.on("error",()=>{
  console.log("error in mongo store");
})
//session 
sessionobject={secret:process.env.SECRET,
  store, 
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires:Date.now()+7*24*60*60*1000,
    maxAge:7*24*60*60*1000,
    httpOnly:true
  }
}
app.use(session(sessionobject))
app.use(flash())
//passport 
app.use(Passport.initialize())
app.use(Passport.session())
Passport.use(new Localstrategoy(User.authenticate()))
Passport.serializeUser(User.serializeUser());
Passport.deserializeUser(User.deserializeUser());
app.use((req,res,next)=>{
  res.locals.success=req.flash("success")
  res.locals.currentUser=req.user;
  res.locals.response=req;
  next();
})
path=require('path');
mongoose=require('mongoose');
ejsmate=require('ejs-mate');
Listing=require('./models/listing');
mongoose.connect(process.env.ATLAS_URL);
const Review=require("./models/review");
const passport = require('passport');
app.use(methodoverride("_method"));
//ejsmate
app.engine('ejs',ejsmate);
//views
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
//public
app.use(express.static(path.join(__dirname,"public")));
//url encoding
app.use(express.urlencoded({extended:true}));
app.get("/",(req,res)=>{
  res.redirect("/listings")
})
//index route
app.get("/listings",async(req,res)=>{
  
   const alllisting=await (Listing.find());
  res.render("listings/index",{alllisting})
  
})
//update route
app.get("/listings/:id/edit",async(req,res)=>{
  if(!req.isAuthenticated()){
    return res.render("users/login");
  }
  const {id}=req.params;
  const info= await Listing.find({_id:id});
  res.render("listings/edit",{info});


})
//create new
app.get("/listings/new",(req,res)=>{
  if(!req.isAuthenticated()){
    return res.render("users/login");
  }
  res.render("listings/new");
})
//show route
app.get("/listings/:id",async(req,res)=>{

  const {id}=req.params;
  const info= await (Listing.findById(id).populate("reviews").populate("owner"));
  res.render("listings/show",{info})
})

//delete method 
app.delete("/listings/:id",async(req,res)=>{
  
  if(!req.isAuthenticated()){
    return res.render("users/login");
  }
  req.flash("success","deleted")
const {id}=req.params;
await Listing.findByIdAndDelete(id);
res.redirect("/listings");
})

//put method
app.put("/listings/:id",async(req,res)=>{        //upload.single("image")
  // url=req.file.path;
  // filename=req.file.filename
  const {id}=req.params;
  const {title,description,price,country,location}=req.body;
a=await Listing.findByIdAndUpdate(id,{title,description,price,country,location});
// a.image={url,filename}
await a.save()
res.redirect("/listings");
  
})
//post method
app.post("/listings",upload.single("image"),async(req,res)=>{
  url=req.file.path;
  filename=req.file.filename
  owner=req.user._id
  req.flash("success","listing added successfully")
  const {title,description,image,price,country,location}=req.body;
 const newlisting=new Listing({title,description,image,price,country,location,owner})
 newlisting.image={url,filename}
 await newlisting.save();
 console.log("success");
  res.redirect("/listings");
})

//reviews post
app.post("/listings/:id/reviews",async(req,res)=>{
  if(!req.isAuthenticated()){
    return res.render("users/login");
  }
  const {id}=req.params;
  const {rating,comment}=req.body;
  let a=await Listing.findById(id);
  let newreview=new Review({
rating,
comment
  });
  newreview.author_id=req.user._id
  newreview.author=req.user.username
  console.log(newreview.author);
  a.reviews.push(newreview);
 await newreview.save();
 await a.save();
console.log("added successfully");
res.redirect(`/listings/${id}`);

})
//delete review
app.delete("/listings/:id/reviews/:reviewid",async(req,res)=>{
  const {id,reviewid}=req.params;
  await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewid}});
  await Review.findByIdAndDelete(reviewid);
  res.redirect(`/listings/${id}`);
})

//Sign up
app.get("/signup",(req,res)=>{
  res.render("users/signup")
});
app.post("/signup",async(req,res)=>{
  const {email,username,password}=req.body;
newuser=new User({
  email,username
});
a=await User.register(newuser,password)
req.login(a,(err)=>{
  if(err){
    return next(err)
  }
  req.flash("success","Welcome!")
  res.redirect("/listings")
})
})
//login 
app.get("/login",(req,res)=>{
  res.render("users/login",)
});
app.post("/login",passport.authenticate('local',{failureRedirect:'/login',failureFlash:true}),async(req,res)=>{
  req.flash("success","welcome back!")
    res.redirect("/listings")

})
//logout
app.get("/logout",(req,res,next)=>{
  req.logout((err)=>{
    if(err)
    return next(err)
  req.flash("success","Successfully Logged out ");
  res.redirect("/listings")
})
  })

app.listen(8000,()=>{
  console.log("working");
});