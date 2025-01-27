const { Schema } = require('mongoose');
const review = require('./review');

mongoose = require('mongoose');
schema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    image: {
        url:String,
        filename:String
    },
    price: Number,
    location: String,
    country: String,
    reviews:[{
        type:Schema.Types.ObjectId,
        ref:"review"
    }],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"user"
    }
})
//to delete reviews of deleted listing
schema.post("findOneAndDelete",async(listing)=>{
    if(listing){
a=await review.deleteMany({_id:{$in:listing.reviews}})
    }
})
listing = mongoose.model("listing", schema);

module.exports = listing;