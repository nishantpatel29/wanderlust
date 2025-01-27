const { default: mongoose, Schema } = require("mongoose");

const reviewschema=new Schema({
comment:String,
rating:{
    type:Number,
    min:1,
    max:5
},
createdat:{
    type:Date,
    default:Date.now(),
},
author_id:{
    type:String,
},
author:String
})
module.exports=mongoose.model("review",reviewschema);