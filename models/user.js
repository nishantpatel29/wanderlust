const { default: mongoose, Schema } = require("mongoose");

passportLocalMongoose=require("passport-local-mongoose")
const userschema=new Schema({
    email:{
        type:String,
        required:true,
    }
})
userschema.plugin(passportLocalMongoose)     
module.exports=mongoose.model("user",userschema)
